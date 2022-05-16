import {createSharedInt32Array} from "../dataStructures/sharedArrays"

export const enum record_encoding {
    unintialized = -1,
    size_per_element = 2,
    table_offset = 1
}

export class EntityRecords {
    records: Int32Array
    protected _index: number

    constructor(initialCapacity: number) {
        this.records = createSharedInt32Array(
            initialCapacity * record_encoding.size_per_element
        ).fill(record_encoding.unintialized)
        this._index = 0
    }

    index(entityId: number): this {
        this._index = (
            entityId * record_encoding.size_per_element
        )
        return this
    }

    get row(): number {
        return this.records[(this._index)]
    }

    set row(row: number) {
        this.records[(this._index)] = row
    }

    get_row(entityId: number): number {
        return this.records[
            (entityId * record_encoding.size_per_element)
        ]
    }
    
    set_row(entityId: number, row: number) {
        this.records[
            (entityId * record_encoding.size_per_element)
        ] = row
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

    get_table(entityId: number): number {
        return this.records[
            (entityId * record_encoding.size_per_element)
            + record_encoding.table_offset
        ]
    }
    
    set_table(entityId: number, table: number) {
        this.records[
            (entityId * record_encoding.size_per_element)
            + record_encoding.table_offset
        ] = table
    }
}
