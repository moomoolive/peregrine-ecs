import {createSharedInt32Array} from "../dataStructures/sharedArrays"

export const enum record_encoding {
    unintialized = -1,
    size_per_element = 2,
    table_offset = 1,
    no_components_specified_yet = -2
}

export const enum standard_entity {
    reserved_end = 50,
    reserved_start = 0,
    reserved_count = reserved_end - reserved_start,
    start_of_user_defined_entities = 4_096, 

    /* reserved entity ids */
    ecs_id = 0, /* the base id, any entity in the ecs has this component */
    ecs_component = 1 /* refers to components defined by users */
}

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

    allocateEntity(
        index: number, 
        row: number,
        table: number
    ): number {
        this.index(index)
        this.table = table
        this.row = row
        return index
    }

    get row(): number {
        return this.records[(this._index)]
    }
    set row(row: number) {
        this.records[(this._index)] = row
    }

    get table(): number {
        return this.records[
            (this._index)
            + record_encoding.table_offset
        ]
    }
    set table(table: number) {
        this.records[
            (this._index)
            + record_encoding.table_offset
        ] = table
    }
}
