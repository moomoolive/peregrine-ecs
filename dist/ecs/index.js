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
    constructor(params) {
        const { components, relations = {}, entities = {}, maxEntities = 500000 /* limit */, allocatorInitialMemoryMB = 50, mode = "development" } = params;
        this.declaredComponents = components;
        const { proxyClasses, orderedComponentNames } = (0, index_2.generateComponentStructProxies)(components);
        this.componentStructProxies = proxyClasses;
        this.components = (0, index_1.componentRegistryMacro)(orderedComponentNames);
        const { registry: generatedRelations, orderedKeys: relationKeys } = (0, index_1.relationRegistryMacro)(relations);
        this.relations = generatedRelations;
        this.declaredRelations = relations;
        this.relationsCount = relationKeys.length;
        const { registry: generatedEntites, orderedKeys: entityKeys } = (0, index_1.entitiesRegistryMacro)(entities);
        this.entities = generatedEntites;
        this.declaredEntities = entities;
        this.unusedIndexes = (0, sharedArrays_1.createSharedInt32Array)(maxEntities);
        this.unusedIndexesCount = 0;
        if (maxEntities < 5000 /* minimum */) {
            throw (0, errors_1.assertion)(`max entities must be ${5000 /* minimum */.toLocaleString("en-us")} or greater (got ${maxEntities.toLocaleString("en-us")})`);
        }
        this.records = new records_1.EntityIndex(maxEntities);
        this.tableAllocator = (0, index_3.createComponentAllocator)(1048576 /* per_megabyte */ * allocatorInitialMemoryMB, false);
        this.hashToTableIndex = new Map();
        this.largestIndex = (4095 /* start_of_user_defined_entities */
            + entityKeys.length);
        this.records.init();
        const { defaultTables } = (0, standardTables_1.createDefaultTables)(this.tableAllocator, this.records, this.componentCount, this.relationsCount, entityKeys.length);
        this.tables = [...defaultTables];
        for (const { id, hash } of defaultTables) {
            this.hashToTableIndex.set(hash, id);
        }
        this.componentDebugInfo = (0, debugging_1.generateComponentDebugInfo)(this.componentStructProxies);
    }
    get entityCount() {
        return (this.largestIndex
            - 4095 /* start_of_user_defined_entities */);
    }
    get componentCount() {
        return this.componentStructProxies.length;
    }
    addToRootTable(id) {
        const rootTable = this.tables[2 /* ecs_root_table */];
        rootTable.ensureSize(1, this.tableAllocator);
        const row = rootTable.length++;
        rootTable.entities[row] = id;
        const generationCount = this.records.recordEntity(id, row, 2 /* ecs_root */);
        return generationCount;
    }
    newId() {
        if (this.unusedIndexesCount < 1) {
            const index = this.largestIndex++;
            const generation = this.addToRootTable(index);
            return (0, ids_1.createId)(index, generation);
        }
        const index = --this.unusedIndexesCount;
        const id = this.unusedIndexes[index];
        const generation = this.addToRootTable(this.unusedIndexes[index]);
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
    addId(entityId, tagId) {
        if ((0, ids_1.isImmutable)(entityId)) {
            return -2 /* entity_immutable */;
        }
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
        if ((0, ids_1.isImmutable)(entityId)) {
            return -2 /* entity_immutable */;
        }
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
    delete(entityId) {
        if ((0, ids_1.isImmutable)(entityId)) {
            return -2 /* entity_immutable */;
        }
        const originalId = (0, ids_1.stripIdMeta)(entityId);
        const { tableId, row, generationCount } = this.records.index(originalId);
        if (!(0, records_1.entityIsInitialized)(tableId, generationCount, entityId)) {
            return -1 /* entity_uninitialized */;
        }
        this.records.unsetEntity(originalId);
        this.tables[tableId].removeEntity(row);
        /* recycle entity id, stash for later use */
        const unusedSlot = this.unusedIndexesCount++;
        this.unusedIndexes[unusedSlot] = originalId;
        return 2 /* successfully_deleted */;
    }
    /* debugging tools */
    "~all_components_info"() {
        return this.componentDebugInfo;
    }
    "~debug_component"(componentId) {
        const baseId = (0, ids_1.stripIdMeta)(componentId);
        if (!(0, ids_1.isComponent)(baseId)) {
            throw (0, errors_1.assertion)(`inputted id is not a component (got ${componentId.toLocaleString("en-us")})`);
        }
        const id = (0, index_2.deserializeComponentId)(baseId);
        return this.componentDebugInfo[id];
    }
    "~entity_index"(entityId) {
        const originalId = (0, ids_1.stripIdMeta)(entityId);
        const { tableId, row, } = this.records.index(originalId);
        return {
            id: entityId,
            table: tableId,
            row,
            index: originalId
        };
    }
    get "~preciseEntityCount"() {
        return (this.entityCount
            + 50 /* reserved_count */
            + this.componentCount
            + this.relationsCount);
    }
}
exports.Ecs = Ecs;
Ecs.MAX_FIELDS_PER_COMPONENT = 9 /* max_fields */;
Ecs.MAX_COMPONENTS = 256 /* max_components */;
Ecs.MAX_RELATIONS = 1400 /* approx_max_count */;
