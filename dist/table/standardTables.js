"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultTables = exports.ECS_COMPONENT_TABLE_HASH = exports.ECS_ID_TABLE_HASH = void 0;
const index_1 = require("./index");
const index_2 = require("../allocator/index");
exports.ECS_ID_TABLE_HASH = "id-01";
exports.ECS_COMPONENT_TABLE_HASH = "comp-01";
function ecsIdTable(allocator, records) {
    const componentIds = (0, index_2.i32Malloc)(allocator, 2);
    const newTableMeta = (0, index_2.i32Malloc)(allocator, 2 /* meta_size */);
    const entities = (0, index_2.i32Malloc)(allocator, 5);
    entities[0] = 0 /* ecs_id */;
    entities[1] = 1 /* ecs_component */;
    const entity = records.index(0 /* ecs_id */);
    entity.table = 0 /* ecs_id */;
    entity.row = 0;
    return new index_1.Table(0 /* ecs_id */, exports.ECS_ID_TABLE_HASH, componentIds, [], newTableMeta, new Int32Array(), entities);
}
function ecsComponentTable(allocator, records, componentCount) {
    const componentIds = (0, index_2.i32Malloc)(allocator, 2);
    const newTableMeta = (0, index_2.i32Malloc)(allocator, 2 /* meta_size */);
    const entities = (0, index_2.i32Malloc)(allocator, 50 /* reserved_count */ + componentCount);
    entities[0] = 0 /* ecs_id */;
    entities[1] = 1 /* ecs_component */;
    const componentEntity = records.index(1 /* ecs_component */);
    componentEntity.table = 1 /* ecs_component */;
    componentEntity.row = 1;
    const start = 50 /* reserved_end */;
    const end = start + componentCount;
    const componentEntityRowStart = 2;
    for (let i = start; i < end; i++) {
        const entity = records.index(i);
        const componentId = i + componentEntityRowStart;
        entities[i] = componentId;
        entity.table = 1;
        entity.row = componentId;
    }
    return new index_1.Table(0 /* ecs_id */, exports.ECS_ID_TABLE_HASH, componentIds, [], newTableMeta, new Int32Array(), entities);
}
function createDefaultTables(allocator, records, componentCount) {
    return [
        ecsIdTable(allocator, records),
        ecsComponentTable(allocator, records, componentCount)
    ];
}
exports.createDefaultTables = createDefaultTables;
