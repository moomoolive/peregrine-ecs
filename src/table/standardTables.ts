import {
    Table,
    table_hashes,
    generateTableHash,
    createTableMeta,
} from "./index"
import {
    Allocator,
    i32Malloc
} from "../allocator/index"
import {
    standard_entity,
    STANDARD_ENTITIES
} from "../entities/index"
import {deserializeComponentId} from "../components/index"
import {EntityRecords} from "../entities/records"
import {
    computeRelationId
} from "../dataStructures/registries/index"

export const enum standard_tables {
    count = 3,
    
    ecs_id = 0,
    ecs_component = 1,
    ecs_root_table = 2 /* this table is where all user-defined entities are first inserted */
}

const NO_COMPONENTS = () => []
const NO_COMPONENT_PTRS = () => new Int32Array()

function addStandardEntitesToi32(arr: Int32Array) {
    for (let i = 0; i < STANDARD_ENTITIES.length; i++) {
        arr[i] = STANDARD_ENTITIES[i]
    }
}

const STANDARD_COMPONENTS_HASH = (
    table_hashes.component_separator  
    + STANDARD_ENTITIES.join(".")
)

export const ECS_ID_TABLE_HASH = `${table_hashes.non_standard_hash_prefix}id${table_hashes.tag_component_divider}${STANDARD_COMPONENTS_HASH}`
function ecsIdTable(
    allocator: Allocator,
    records: EntityRecords
): Table {
    const componentIds = i32Malloc(allocator, 2)
    componentIds[standard_entity.ecs_id] = standard_entity.ecs_id
    componentIds[standard_entity.ecs_component] = standard_entity.ecs_component
    const entities = i32Malloc(
        allocator, 
        standard_entity.reserved_count
    )
    addStandardEntitesToi32(entities)
    records.recordEntity(
        standard_entity.ecs_id,
        standard_tables.ecs_id,
        standard_tables.ecs_id,
    )
    const table = new Table(
        standard_tables.ecs_id,
        ECS_ID_TABLE_HASH,
        componentIds,
        NO_COMPONENTS(),
        createTableMeta(allocator),
        NO_COMPONENT_PTRS(),
        entities,
        standard_entity.reserved_count
    )
    table.length += standard_entity.reserved_count
    return table
}

export const ECS_COMPONENT_TABLE_HASH = `${table_hashes.non_standard_hash_prefix}component${table_hashes.tag_component_divider}${STANDARD_COMPONENTS_HASH}`
function ecsComponentTable(
    allocator: Allocator,
    records: EntityRecords,
    componentCount: number
): Table {
    const componentIds = i32Malloc(allocator, 2)
    componentIds[standard_entity.ecs_id] = standard_entity.ecs_id
    componentIds[standard_entity.ecs_component] = standard_entity.ecs_component
    const capacity = (
        standard_entity.reserved_count 
        + componentCount
    )
    const entities = i32Malloc(allocator, capacity)
    addStandardEntitesToi32(entities)
    records.recordEntity(
        standard_entity.ecs_component,
        standard_tables.ecs_component,
        standard_tables.ecs_component,
    )
    const start = standard_entity.reserved_end
    const end  = start + componentCount
    for (let i = start; i < end; i++) {
        records.recordEntity(
            i, i, standard_tables.ecs_component
        )
        entities[i] = i 
    }
    const table = new Table(
        standard_tables.ecs_component,
        ECS_COMPONENT_TABLE_HASH,
        componentIds,
        NO_COMPONENTS(),
        createTableMeta(allocator),
        NO_COMPONENT_PTRS(),
        entities,
        capacity
    )
    table.length += capacity
    return table
}

export function ecsEntityTable(
    allocator: Allocator,
    records: EntityRecords,
    relationsCount: number
): Table {
    const componentIds = i32Malloc(allocator, 1)
    componentIds[standard_entity.ecs_id] = standard_entity.ecs_id
    const capacity = 50 + relationsCount
    const entities = i32Malloc(allocator, capacity)
    for (let i = 0; i < relationsCount; i++) {
        const id = computeRelationId(i)
        records.recordEntity(
            id,
            i,
            standard_tables.ecs_root_table
        )
        entities[i] = id
    }
    const components = NO_COMPONENTS()
    const table = new Table(
        standard_tables.ecs_root_table,
        generateTableHash(componentIds, components.length),
        componentIds,
        components,
        createTableMeta(allocator),
        NO_COMPONENT_PTRS(),
        entities,
        capacity
    )
    table.length += relationsCount
    return table
} 

export function createDefaultTables(
    allocator: Allocator,
    records: EntityRecords,
    componentCount: number,
    relationsCount: number
): {defaultTables: Table[]} {
    return {
        defaultTables: [
            ecsIdTable(allocator, records),
            ecsComponentTable(allocator, records, componentCount),
            ecsEntityTable(allocator, records, relationsCount)
        ]
    }
}