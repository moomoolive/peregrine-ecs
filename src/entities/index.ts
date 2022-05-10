import {SharedInt32Array} from "../dataStructures/sharedArrays"

export const enum encoding {
    unintialized = -1
}

export class EntityRecords {
    tablePtrIds: Int32Array
    row: Int32Array

    constructor(initialCapacity: number) {
        this.tablePtrIds = SharedInt32Array(initialCapacity).fill(encoding.unintialized)
        this.row = SharedInt32Array(initialCapacity).fill(encoding.unintialized)
    }
}
