import {SharedInt32Array} from "../dataStructures/sharedArrays"

export const enum encoding {
    no_archetype = -1
}

export class EntityRecords {
    "&tablePtrs": Int32Array
    row: Int32Array

    constructor(initialCapacity: number) {
        this["&tablePtrs"] = SharedInt32Array(initialCapacity).fill(encoding.no_archetype)
        this.row = SharedInt32Array(initialCapacity).fill(encoding.no_archetype)
    }
}
