"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ecs = void 0;
const standardTables_1 = require("../table/standardTables");
const index_1 = require("../entities/index");
const index_2 = require("../dataStructures/registries/index");
const index_3 = require("../components/index");
const debugging_1 = require("./debugging");
const mutator_1 = require("../entities/mutator");
const sharedArrays_1 = require("../dataStructures/sharedArrays");
const index_4 = require("../allocator/index");
const ids_1 = require("../entities/ids");
const errors_1 = require("../debugging/errors");
class Ecs {
    constructor(params, { maxEntities = 500000 /* limit */, allocatorInitialMemoryMB = 50, mode = "development" } = {}) {
        const { components } = params;
        this.schemas = components;
        const { proxyClasses, orderedComponentNames } = (0, index_3.generateComponentStructProxies)(components);
        this.componentStructProxies = proxyClasses;
        this.components = (0, index_2.componentRegistryMacro)(orderedComponentNames);
        this.unusedIds = (0, sharedArrays_1.createSharedInt32Array)(maxEntities);
        this.unusedIdsCount = 0;
        this.records = new index_1.EntityRecords(maxEntities > 5000 /* minimum */ ?
            maxEntities
            : 5000 /* minimum */);
        this.tableAllocator = (0, index_4.createComponentAllocator)(1048576 /* per_megabyte */ * allocatorInitialMemoryMB, false);
        this.hashToTableIndex = new Map();
        this.largestId = 4095 /* start_of_user_defined_entities */;
        this.records.init();
        const { defaultTables } = (0, standardTables_1.createDefaultTables)(this.tableAllocator, this.records, this.componentStructProxies.length);
        this.tables = [...defaultTables];
        for (const { id, hash } of defaultTables) {
            this.hashToTableIndex.set(hash, id);
        }
        this.componentDebugInfo = (0, debugging_1.generateComponentDebugInfo)(this.componentStructProxies);
    }
    get entityCount() {
        return this.largestId - 4095 /* start_of_user_defined_entities */;
    }
    get preciseEntityCount() {
        return (this.entityCount
            + 50 /* reserved_count */
            + this.componentCount);
    }
    get componentCount() {
        return this.componentStructProxies.length;
    }
    allComponentDebugInfo() {
        return this.componentDebugInfo;
    }
    debugComponent(componentId) {
        if (componentId < 50 /* components_start */
            || componentId > 50 /* components_start */ + this.componentCount) {
            throw TypeError((0, errors_1.assertion)(`inputted id (got ${componentId.toString()}) is not a component`));
        }
        const id = (0, index_3.deserializeComponentId)(componentId);
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
        const originalId = (0, ids_1.extractBaseId)(entityId);
        const { tableId } = this.records.index(originalId);
        if (tableId === -1 /* unintialized */) {
            return false;
        }
        return this.tables[tableId].has(id);
    }
    isAlive(entityId) {
        const originalId = (0, ids_1.extractBaseId)(entityId);
        const entity = this.records.index(originalId);
        return (entity.tableId !== -1 /* unintialized */
            && entity.generationCount === (0, ids_1.extractGenerationCount)(entityId));
    }
    delete(entityId) {
        const originalId = (0, ids_1.extractBaseId)(entityId);
        const { tableId, row } = this.records.index(originalId);
        if (tableId === -1 /* unintialized */) {
            return false;
        }
        this.records.unsetEntity(originalId);
        this.tables[tableId].removeEntity(row);
        /* recycle entity id, stash for later use */
        const unusedSlot = this.unusedIdsCount++;
        this.unusedIds[unusedSlot] = originalId;
        return true;
    }
    addTag(entityId, tagId) {
        const entity = this.records.index(entityId);
        const { tableId, row } = entity;
        if (tableId === -1 /* unintialized */) {
            return 1 /* entity_uninitialized */;
        }
        const tables = this.tables;
        const table = tables[tableId];
        if (table.componentIndexes.has(tagId)) {
            return 2 /* tag_exists */;
        }
        const targetTableId = table.addEdges.get(tagId);
        const allocator = this.tableAllocator;
        const targetTable = targetTableId !== undefined ?
            tables[targetTableId] : (0, mutator_1.findTableOrCreate)(this.hashToTableIndex, table, tagId, tables, allocator, this.componentStructProxies);
        const newTable = targetTable.id;
        // proceed to move entity data from current table to 
        // target table, (identical components, tags + new)
        const newRow = (0, mutator_1.shiftComponentDataAligned)(table, targetTable, row, allocator);
        entity.tableId = newTable;
        entity.row = newRow;
        return 0 /* successful_update */;
    }
}
exports.Ecs = Ecs;
Ecs.MAX_FIELDS_PER_COMPONENT = 9 /* max_fields */;
Ecs.MAX_COMPONENTS = 256 /* max_components */;
Ecs.MAX_RELATIONS = 1400 /* approx_max_count */;
