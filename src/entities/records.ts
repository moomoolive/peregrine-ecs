import {createSharedInt32Array} from "../dataStructures/sharedArrays"
import {preserveSixBits, extractGenerationCount} from "./ids"

export const enum record_encoding {
    size_per_element = 3,
    row_offset = 0,
    table_id_offset = 1,
    generation_count_offset = 2,

    unintialized = -1
}

export function entityIsInitialized(
    tableId: number,
    generationCount: number,
    entityId: number
): boolean {
    return (
        tableId !== record_encoding.unintialized
        && generationCount === extractGenerationCount(entityId)
    )
}

export class EntityIndex {
    buffer: Int32Array
    protected _index: number

    constructor(initialCapacity: number) {
        this.buffer = createSharedInt32Array(
            initialCapacity * record_encoding.size_per_element
        )
        this._index = 0
    }

    init() {
        this.buffer.fill(record_encoding.unintialized)
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
        this.buffer[tableIndex] = table
        const rowIndex = targetIndex + record_encoding.row_offset
        this.buffer[rowIndex] = row
        const generationIndex = targetIndex + record_encoding.generation_count_offset
        /* if generation count is bigger than 63, reset to 0 */
        const generationCount = preserveSixBits(this.buffer[generationIndex] + 1)
        this.buffer[generationIndex] = generationCount
        return generationCount
    }

    unsetEntity(index: number) {
        const targetIndex = index * record_encoding.size_per_element
        const tableIndex = targetIndex + record_encoding.table_id_offset
        this.buffer[tableIndex] = record_encoding.unintialized
        const rowIndex = targetIndex + record_encoding.row_offset
        this.buffer[rowIndex] = record_encoding.unintialized
        return index
    }

    get row(): number {
        return this.buffer[(this._index)]
    }
    set row(row: number) {
        this.buffer[(this._index)] = row
    }

    get tableId(): number {
        return this.buffer[
            (this._index)
            + record_encoding.table_id_offset
        ]
    }
    set tableId(table: number) {
        this.buffer[
            (this._index)
            + record_encoding.table_id_offset
        ] = table
    }

    get generationCount(): number {
        return this.buffer[
            (this._index)
            + record_encoding.generation_count_offset
        ]
    }
    set generationCount(table: number) {
        this.buffer[
            (this._index)
            + record_encoding.generation_count_offset
        ] = table
    }
}