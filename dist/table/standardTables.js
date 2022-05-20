"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultTables = exports.ecsEntityTable = exports.ECS_COMPONENT_TABLE_HASH = exports.ECS_ID_TABLE_HASH = void 0;
const index_1 = require("./index");
const index_2 = require("../allocator/index");
const index_3 = require("../entities/index");
const index_4 = require("../dataStructures/registries/index");
const NO_COMPONENTS = () => [];
const NO_COMPONENT_PTRS = () => new Int32Array();
function addStandardEntitesToi32(arr) {
    for (let i = 0; i < index_3.STANDARD_ENTITIES.length; i++) {
        arr[i] = index_3.STANDARD_ENTITIES[i];
    }
}
const STANDARD_COMPONENTS_HASH = index_3.STANDARD_ENTITIES.join("");
exports.ECS_ID_TABLE_HASH = `${"*" /* non_standard_hash_prefix */}id${"&" /* tag_component_divider */}${STANDARD_COMPONENTS_HASH}`;
function ecsIdTable(allocator, records) {
    const componentIds = (0, index_2.i32Malloc)(allocator, 2);
    componentIds[0 /* ecs_id */] = 0 /* ecs_id */;
    componentIds[1 /* ecs_component */] = 1 /* ecs_component */;
    const entities = (0, index_2.i32Malloc)(allocator, 50 /* reserved_count */);
    addStandardEntitesToi32(entities);
    records.recordEntity(0 /* ecs_id */, 0 /* ecs_id */, 0 /* ecs_id */);
    const table = new index_1.Table(0 /* ecs_id */, exports.ECS_ID_TABLE_HASH, componentIds, NO_COMPONENTS(), (0, index_1.createTableMeta)(allocator), NO_COMPONENT_PTRS(), entities, 50 /* reserved_count */);
    table.length += 50 /* reserved_count */;
    return table;
}
exports.ECS_COMPONENT_TABLE_HASH = `${"*" /* non_standard_hash_prefix */}component${"&" /* tag_component_divider */}${STANDARD_COMPONENTS_HASH}`;
function ecsComponentTable(allocator, records, componentCount) {
    const componentIds = (0, index_2.i32Malloc)(allocator, 2);
    componentIds[0 /* ecs_id */] = 0 /* ecs_id */;
    componentIds[1 /* ecs_component */] = 1 /* ecs_component */;
    const capacity = (50 /* reserved_count */
        + componentCount);
    const entities = (0, index_2.i32Malloc)(allocator, capacity);
    addStandardEntitesToi32(entities);
    records.recordEntity(1 /* ecs_component */, 1 /* ecs_component */, 1 /* ecs_component */);
    const start = 50 /* reserved_end */;
    const end = start + componentCount;
    for (let i = start; i < end; i++) {
        records.recordEntity(i, 1 /* ecs_component */, i);
        entities[i] = i;
    }
    const table = new index_1.Table(1 /* ecs_component */, exports.ECS_COMPONENT_TABLE_HASH, componentIds, NO_COMPONENTS(), (0, index_1.createTableMeta)(allocator), NO_COMPONENT_PTRS(), entities, capacity);
    table.length += capacity;
    return table;
}
function ecsEntityTable(allocator, records, relationsCount) {
    const componentIds = (0, index_2.i32Malloc)(allocator, 1);
    componentIds[0 /* ecs_id */] = 0 /* ecs_id */;
    const capacity = 50 + relationsCount;
    const entities = (0, index_2.i32Malloc)(allocator, capacity);
    for (let i = 0; i < relationsCount; i++) {
        const id = (0, index_4.computeRelationId)(i);
        records.recordEntity(id, i, 2 /* ecs_root_table */);
        entities[i] = id;
    }
    const components = NO_COMPONENTS();
    const table = new index_1.Table(2 /* ecs_root_table */, (0, index_1.generateTableHash)(componentIds, components.length), componentIds, components, (0, index_1.createTableMeta)(allocator), NO_COMPONENT_PTRS(), entities, capacity);
    table.length += relationsCount;
    return table;
}
exports.ecsEntityTable = ecsEntityTable;
function createDefaultTables(allocator, records, componentCount, relationsCount) {
    return {
        defaultTables: [
            ecsIdTable(allocator, records),
            ecsComponentTable(allocator, records, componentCount),
            ecsEntityTable(allocator, records, relationsCount)
        ]
    };
}
exports.createDefaultTables = createDefaultTables;
