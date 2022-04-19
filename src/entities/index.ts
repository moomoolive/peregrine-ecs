import {SharedInt32Array} from "../dataStructures/veci32/index"

export class EntityRecords {
    static expand(records: EntityRecords, additional: number) {
        const capacity = records.archetype.length + additional
        const archetype = SharedInt32Array(capacity)
        archetype.set(records.archetype, 0)
        const meta = SharedInt32Array(capacity)
        meta.set(records.generationCount, 0)
        records.archetype = archetype
        records.generationCount = meta
    }
    
    archetype: Int32Array
    generationCount: Int32Array
    length: number
    
    constructor(capacity: number) {
        this.archetype = SharedInt32Array(capacity)
        this.generationCount = SharedInt32Array(capacity)
        this.length = 0
    }
} 