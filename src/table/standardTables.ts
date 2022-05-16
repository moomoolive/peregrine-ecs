import {
    Table,
    table_encoding
} from "./index"
import {
    Allocator,
    i32Malloc
} from "../allocator/index"
import {
    standard_entity,
    EntityRecords
} from "../entities/index"

export const enum std_tables {
    count = 2,
    ecs_id = 0,
    ecs_component = 1,
}

export const ECS_ID_TABLE_HASH = "id-01"
export const ECS_COMPONENT_TABLE_HASH = "comp-01"

function ecsIdTable(
    allocator: Allocator,
    records: EntityRecords
): Table {
    const componentIds = i32Malloc(allocator, 2)
    const newTableMeta = i32Malloc(
        allocator, 
        table_encoding.meta_size
    )
    const entities = i32Malloc(allocator, 5)
    entities[0] = standard_entity.ecs_id
    entities[1] = standard_entity.ecs_component
    const entity = records.index(standard_entity.ecs_id)
    entity.table = std_tables.ecs_id
    entity.row = 0
    return new Table(
        std_tables.ecs_id,
        ECS_ID_TABLE_HASH,
        componentIds,
        [],
        newTableMeta,
        new Int32Array(),
        entities
    )
}

function ecsComponentTable(
    allocator: Allocator,
    records: EntityRecords,
    componentCount: number
): Table {
    const componentIds = i32Malloc(allocator, 2)
    const newTableMeta = i32Malloc(
        allocator, 
        table_encoding.meta_size
    )
    const entities = i32Malloc(
        allocator, standard_entity.reserved_count + componentCount
    )
    entities[0] = standard_entity.ecs_id
    entities[1] = standard_entity.ecs_component
    const componentEntity = records.index(standard_entity.ecs_component)
    componentEntity.table = std_tables.ecs_component
    componentEntity.row = 1
    
    const start = standard_entity.reserved_end
    const end  = start + componentCount
    const componentEntityRowStart = 2
    for (let i = start; i < end; i++) {
        const entity = records.index(i)
        const componentId = i + componentEntityRowStart
        entities[i] = componentId
        entity.table = 1
        entity.row = componentId
    }

    return new Table(
        std_tables.ecs_id,
        ECS_ID_TABLE_HASH,
        componentIds,
        [],
        newTableMeta,
        new Int32Array(),
        entities
    )
}

export function createDefaultTables(
    allocator: Allocator,
    records: EntityRecords,
    componentCount: number
): Table[] {
    return [
        ecsIdTable(allocator, records),
        ecsComponentTable(allocator, records, componentCount)
    ]
}