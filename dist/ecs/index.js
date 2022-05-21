"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ecs = void 0;
const standardTables_1 = require("../table/standardTables");
const records_1 = require("../entities/records");
const index_1 = require("../dataStructures/registries/index");
const index_2 = require("../components/index");
const debugging_1 = require("./debugging");
const mutations_1 = require("../entities/mutations");
const sharedArrays_1 = require("../dataStructures/sharedArrays");
const index_3 = require("../allocator/index");
const ids_1 = require("../entities/ids");
const errors_1 = require("../debugging/errors");
class Ecs {
    constructor(params, { maxEntities = 500000 /* limit */, allocatorInitialMemoryMB = 50, mode = "development", relations = [] } = {}) {
        const { components } = params;
        this.schemas = components;
        const { proxyClasses, orderedComponentNames } = (0, index_2.generateComponentStructProxies)(components);
        this.componentStructProxies = proxyClasses;
        this.components = (0, index_1.componentRegistryMacro)(orderedComponentNames);
        const { relations: generatedRelations } = (0, index_1.relationRegistryMacro)(relations);
        this.relations = generatedRelations;
        this.declaredRelations = relations;
        this.unusedIds = (0, sharedArrays_1.createSharedInt32Array)(maxEntities);
        this.unusedIdsCount = 0;
        if (maxEntities < 5000 /* minimum */) {
            throw (0, errors_1.assertion)(`max entities must be ${5000 /* minimum */.toLocaleString("en-us")} or greater (got ${maxEntities.toLocaleString("en-us")})`);
        }
        this.records = new records_1.EntityRecords(maxEntities < 5000 /* minimum */ ?
            5000 /* minimum */
            : maxEntities);
        this.tableAllocator = (0, index_3.createComponentAllocator)(1048576 /* per_megabyte */ * allocatorInitialMemoryMB, false);
        this.hashToTableIndex = new Map();
        this.largestId = 4095 /* start_of_user_defined_entities */;
        this.records.init();
        const { defaultTables } = (0, standardTables_1.createDefaultTables)(this.tableAllocator, this.records, this.componentCount, this.relationsCount);
        this.tables = [...defaultTables];
        for (const { id, hash } of defaultTables) {
            this.hashToTableIndex.set(hash, id);
        }
        this.componentDebugInfo = (0, debugging_1.generateComponentDebugInfo)(this.componentStructProxies);
    }
    get entityCount() {
        return (this.largestId
            - 4095 /* start_of_user_defined_entities */);
    }
    get preciseEntityCount() {
        return (this.entityCount
            + 50 /* reserved_count */
            + this.componentCount
            + this.relationsCount);
    }
    get componentCount() {
        return this.componentStructProxies.length;
    }
    get relationsCount() {
        return (this.declaredRelations.length
            + 1 /* standard_relations_count */);
    }
    allComponentDebugInfo() {
        return this.componentDebugInfo;
    }
    debugComponent(componentId) {
        const baseId = (0, ids_1.stripIdMeta)(componentId);
        if (!(0, ids_1.isComponent)(baseId)) {
            throw (0, errors_1.assertion)(`inputted id is not a component (got ${componentId.toLocaleString("en-us")})`);
        }
        const id = (0, index_2.deserializeComponentId)(baseId);
        return this.componentDebugInfo[id];
    }
    addToBlankTable(id) {
        const blankTable = this.tables[2 /* ecs_root_table */];
        blankTable.ensureSize(1, this.tableAllocator);
        const row = blankTable.length++;
        blankTable.entities[row] = id;
        const generationCount = this.records.recordEntity(id, row, 2 /* ecs_root */);
        return generationCount;
    }
    newId() {
        if (this.unusedIdsCount < 1) {
            const id = this.largestId++;
            const generation = this.addToBlankTable(id);
            return (0, ids_1.createId)(id, generation);
        }
        const index = --this.unusedIdsCount;
        const id = this.unusedIds[index];
        const generation = this.addToBlankTable(this.unusedIds[index]);
        return (0, ids_1.createId)(id, generation);
    }
    hasId(entityId, id) {
        const originalId = (0, ids_1.stripIdMeta)(entityId);
        const { tableId, generationCount } = this.records.index(originalId);
        if (!(0, records_1.entityIsInitialized)(tableId, generationCount, entityId)) {
            return false;
        }
        return this.tables[tableId].has(id);
    }
    isAlive(entityId) {
        const originalId = (0, ids_1.stripIdMeta)(entityId);
        const { tableId, generationCount } = this.records.index(originalId);
        return (0, records_1.entityIsInitialized)(tableId, generationCount, entityId);
    }
    delete(entityId) {
        if ((0, ids_1.isImmutable)(entityId)) {
            throw (0, errors_1.assertion)(`entity ${entityId.toLocaleString("en-us")} cannot be deleted, as it was declared as immutable. Components and declared relations are immutable cannot be deleted, are you attempting to do so?`);
        }
        const originalId = (0, ids_1.stripIdMeta)(entityId);
        const { tableId, row, generationCount } = this.records.index(originalId);
        if (!(0, records_1.entityIsInitialized)(tableId, generationCount, entityId)) {
            return -1 /* entity_uninitialized */;
        }
        this.records.unsetEntity(originalId);
        this.tables[tableId].removeEntity(row);
        /* recycle entity id, stash for later use */
        const unusedSlot = this.unusedIdsCount++;
        this.unusedIds[unusedSlot] = originalId;
        return 2 /* successfully_deleted */;
    }
    addId(entityId, tagId) {
        const originalId = (0, ids_1.stripIdMeta)(entityId);
        const entity = this.records.index(originalId);
        const { tableId, row, generationCount } = entity;
        if (!(0, records_1.entityIsInitialized)(tableId, generationCount, entityId)) {
            return -1 /* entity_uninitialized */;
        }
        const tables = this.tables;
        const table = tables[tableId];
        if (table.componentIndexes.has(tagId)) {
            return 1 /* tag_exists */;
        }
        const targetTableId = table.addEdges.get(tagId);
        const allocator = this.tableAllocator;
        const targetTable = targetTableId !== undefined ?
            tables[targetTableId] : (0, mutations_1.findTableOrCreate)(this.hashToTableIndex, table, tagId, tables, allocator);
        const newTable = targetTable.id;
        // proceed to move entity data from current table to 
        // target table, (identical components, tags + new)
        const newRow = (0, mutations_1.shiftComponentDataAligned)(table, targetTable, row, allocator);
        entity.tableId = newTable;
        entity.row = newRow;
        return 0 /* successful_added */;
    }
    removeId(entityId, tagId) {
        const originalId = (0, ids_1.stripIdMeta)(entityId);
        const entity = this.records.index(originalId);
        const { tableId, row, generationCount } = entity;
        if (!(0, records_1.entityIsInitialized)(tableId, generationCount, entityId)) {
            return -1 /* entity_uninitialized */;
        }
        const tables = this.tables;
        const table = tables[tableId];
        if (!table.componentIndexes.has(tagId)) {
            return 3 /* tag_not_found */;
        }
        const targetTableId = table.removeEdges.get(tagId);
        const allocator = this.tableAllocator;
        const targetTable = targetTableId !== undefined ?
            tables[targetTableId] : (0, mutations_1.findTableOrCreateRemoveHash)(this.hashToTableIndex, table, tagId, tables, allocator);
        const newTable = targetTable.id;
        const newRow = (0, mutations_1.shiftComponentDataAligned)(table, targetTable, row, allocator);
        entity.tableId = newTable;
        entity.row = newRow;
        return 4 /* successfully_removed */;
    }
}
exports.Ecs = Ecs;
Ecs.MAX_FIELDS_PER_COMPONENT = 9 /* max_fields */;
Ecs.MAX_COMPONENTS = 256 /* max_components */;
Ecs.MAX_RELATIONS = 1400 /* approx_max_count */;
