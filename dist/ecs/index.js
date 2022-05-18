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
class Ecs {
    constructor(params, { maxEntities = 500000 /* limit */, allocatorInitialMemoryMB = 50, mode = "development" } = {}) {
        const { components } = params;
        this.schemas = components;
        const { proxyClasses, orderedComponentNames } = (0, index_3.generateComponentStructProxies)(components);
        this.componentStructProxies = proxyClasses;
        this.components = (0, index_2.componentRegistryMacro)(orderedComponentNames);
        this.unusedEntities = (0, sharedArrays_1.createSharedInt32Array)(maxEntities);
        this.unusedEntityCount = 0;
        this.entityRecords = new index_1.EntityRecords(maxEntities > 5000 /* minimum */ ?
            maxEntities
            : 5000 /* minimum */);
        this.tableAllocator = (0, index_4.createComponentAllocator)(1048576 /* per_megabyte */ * allocatorInitialMemoryMB, false);
        this.hashToTableIndex = new Map();
        this.largestEntityId = 4096 /* start_of_user_defined_entities */;
        this.entityRecords.init();
        this.tables = [
            ...(0, standardTables_1.createDefaultTables)(this.tableAllocator, this.entityRecords, this.componentStructProxies.length)
        ];
        this.componentDebugInfo = (0, debugging_1.generateComponentDebugInfo)(this.componentStructProxies);
    }
    get entityCount() {
        return this.largestEntityId - 4096 /* start_of_user_defined_entities */;
    }
    get preciseEntityCount() {
        return this.largestEntityId;
    }
    get componentCount() {
        return this.componentStructProxies.length;
    }
    allComponentDebugInfo() {
        return this.componentDebugInfo;
    }
    debugComponent(componentId) {
        const id = (0, index_3.deserializeComponentId)(componentId);
        return this.componentDebugInfo[id];
    }
    addToBlankTable(id) {
        const blankTable = this.tables[0 /* ecs_id */];
        const length = blankTable.ensureSize(1, this.tableAllocator);
        const row = length - 1;
        blankTable.entities[row] = id;
        this.entityRecords.allocateEntity(id, row, 0 /* ecs_id */);
    }
    newEntity() {
        if (this.unusedEntityCount < 1) {
            const id = this.largestEntityId++;
            this.addToBlankTable(id);
            return id;
        }
        const index = --this.unusedEntityCount;
        const id = this.unusedEntities[index];
        this.addToBlankTable(this.unusedEntities[index]);
        return id;
    }
    addTag(entityId, tagId) {
        const entity = this.entityRecords.index(entityId);
        const { table: tableId, row } = entity;
        if (row === -1 /* unintialized */) {
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
        entity.table = newTable;
        entity.row = newRow;
        return 0 /* successful_update */;
    }
}
exports.Ecs = Ecs;
Ecs.MAX_FIELDS_PER_COMPONENT = 9 /* max_fields */;
Ecs.MAX_COMPONENTS = 256 /* max_components */;
