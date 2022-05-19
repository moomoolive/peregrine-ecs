import {createSharedInt32Array} from "../dataStructures/sharedArrays"

export const enum record_encoding {
    size_per_element = 2,
    table_id_offset = 1,
    row_offset = 0,

    unintialized = -1
}

export const enum component_entity_encoding {
    /* right now max count is lower than future reserved 
    max count, because components take a lot of RAM right now. 
    Hopefully in the future this will change */
    future_reserved_max_count = 512, /* 9 bits */
    max_count = 256 /* 8 bits */
}

export const enum reserved_by_ecs_encoding {
    max_count = 50,
    tail_reservation = 10_000
}

export const enum relation_entity_encoding {
    future_reserved_max_id = 4096 - 1, /* 12 bits */
    max_id = 2048 - 1, /* 11 bits */
    max_count = (
        max_id
        - reserved_by_ecs_encoding.max_count
        - component_entity_encoding.future_reserved_max_count
    ),
    approx_max_count = 1_400
}

export const enum standard_entity {
    reserved_start = 0,
    reserved_end = (
        reserved_by_ecs_encoding.max_count 
        - reserved_start
    ),
    reserved_count = reserved_end - reserved_start,

    components_start = reserved_end,
    components_end = (
        components_start 
        + component_entity_encoding.future_reserved_max_count
    ),

    relations_start = components_end,
    relations_end = relation_entity_encoding.future_reserved_max_id,
    start_of_user_defined_entities = (
        relations_end
        + reserved_by_ecs_encoding.tail_reservation
    ), 

    /* reserved entity ids */
    ecs_id = 0, /* the base id, any entity in the ecs has this component */
    ecs_component = 1, /* refers to components defined by users */
    ecs_root = 2, /* any user defined entity starts here */
}

export const STANDARD_ENTITIES = [
    standard_entity.ecs_id,
    standard_entity.ecs_component,
] as const

export const enum entities_encoding {
    /* actual entity limit is 524,287 (19 bits), 
    but this number is easier to remember */
    limit = 500_000,
    /* actual entity minimum is 4,096 (12 bits), 
    but this number is easier to remember */
    minimum = 5_000,
}

export class EntityRecords {
    protected records: Int32Array
    protected _index: number

    constructor(initialCapacity: number) {
        this.records = createSharedInt32Array(
            initialCapacity * record_encoding.size_per_element
        )
        this._index = 0
    }

    init() {
        this.records.fill(record_encoding.unintialized)
    }

    index(entityId: number): this {
        this._index = (
            entityId * record_encoding.size_per_element
        )
        return this
    }

    recordEntity(
        index: number, 
        row: number,
        table: number
    ): number {
        const targetIndex = index * record_encoding.size_per_element
        const tableIndex = targetIndex + record_encoding.table_id_offset
        this.records[tableIndex] = table
        const rowIndex = targetIndex + record_encoding.row_offset
        this.records[rowIndex] = row
        return index
    }

    unsetEntity(index: number) {
        const targetIndex = index * record_encoding.size_per_element
        const tableIndex = targetIndex + record_encoding.table_id_offset
        this.records[tableIndex] = record_encoding.unintialized
        const rowIndex = targetIndex + record_encoding.row_offset
        this.records[rowIndex] = record_encoding.unintialized
        return index
    }

    get row(): number {
        return this.records[(this._index)]
    }
    set row(row: number) {
        this.records[(this._index)] = row
    }

    get tableId(): number {
        return this.records[
            (this._index)
            + record_encoding.table_id_offset
        ]
    }
    set tableId(table: number) {
        this.records[
            (this._index)
            + record_encoding.table_id_offset
        ] = table
    }
}
