import {createSharedInt32Array} from "../dataStructures/sharedArrays"

export const enum encoding {
    unintialized = -1
}

export class EntityRecords {
    tablePtrIds: Int32Array
    row: Int32Array

    constructor(initialCapacity: number) {
        this.tablePtrIds = createSharedInt32Array(initialCapacity).fill(encoding.unintialized)
        this.row = createSharedInt32Array(initialCapacity).fill(encoding.unintialized)
    }
}
