import {createMemory} from "../dataStructures/veci32/index"

// all 32 bits
// (0b1111_1111_1111_1111_1111_1111_1111_1111 >> 0)

/* 
first six bits of EntityRecord.meta
are reserved for entity generation count 
*/
const GENERATION_COUNT_MASK = ~(
    0b1111_1111_1111_1111_1111_1111_1100_0000 >> 0
)

export class EntityRecords {
    static expand(records: EntityRecords, additional: number) {
        const capacity = records.archetype.length + additional
        const archetype = createMemory(capacity)
        archetype.set(records.archetype, 0)
        const meta = createMemory(capacity)
        meta.set(records.meta, 0)
        records.archetype = archetype
        records.meta = meta
    }
    
    archetype: Int32Array
    meta: Int32Array
    length: number
    
    constructor(capacity: number) {
        this.archetype = createMemory(capacity)
        this.meta = createMemory(capacity)
        this.length = 0
    }
} 