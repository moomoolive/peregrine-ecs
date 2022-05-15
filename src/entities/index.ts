import {createSharedInt32Array} from "../dataStructures/sharedArrays"

export const enum encoding {
    unintialized = -1
}

export class EntityRecords {
    tablePtrs: Int32Array
    row: Int32Array

    constructor(initialCapacity: number) {
        this.tablePtrs = createSharedInt32Array(initialCapacity).fill(encoding.unintialized)
        this.row = createSharedInt32Array(initialCapacity).fill(encoding.unintialized)
    }
}
