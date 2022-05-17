"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityRecords = void 0;
const sharedArrays_1 = require("../dataStructures/sharedArrays");
class EntityRecords {
    constructor(initialCapacity) {
        this.records = (0, sharedArrays_1.createSharedInt32Array)(initialCapacity * 2 /* size_per_element */);
        this._index = 0;
    }
    init() {
        this.records.fill(-1 /* unintialized */);
    }
    index(entityId) {
        this._index = (entityId * 2 /* size_per_element */);
        return this;
    }
    allocateEntity(index, row, table) {
        this.index(index);
        this.table = table;
        this.row = row;
        return index;
    }
    get row() {
        return this.records[(this._index)];
    }
    set row(row) {
        this.records[(this._index)] = row;
    }
    get table() {
        return this.records[(this._index)
            + 1 /* table_offset */];
    }
    set table(table) {
        this.records[(this._index)
            + 1 /* table_offset */] = table;
    }
}
exports.EntityRecords = EntityRecords;
