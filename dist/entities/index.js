"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityRecords = void 0;
const sharedArrays_1 = require("../dataStructures/sharedArrays");
class EntityRecords {
    constructor(initialCapacity) {
        this.records = (0, sharedArrays_1.createSharedInt32Array)(initialCapacity * 2 /* size_per_element */);
        this._index = 0;
    }
    index(entityId) {
        this._index = (entityId * 2 /* size_per_element */);
        return this;
    }
    get row() {
        return this.records[(this._index)];
    }
    set row(row) {
        this.records[(this._index)] = row;
    }
    get_row(entityId) {
        return this.records[(entityId * 2 /* size_per_element */)];
    }
    set_row(entityId, row) {
        this.records[(entityId * 2 /* size_per_element */)] = row;
    }
    get table() {
        return this.records[(this._index)
            + 1 /* table_offset */];
    }
    set table(table) {
        this.records[(this._index)
            + 1 /* table_offset */] = table;
    }
    get_table(entityId) {
        return this.records[(entityId * 2 /* size_per_element */)
            + 1 /* table_offset */];
    }
    set_table(entityId, table) {
        this.records[(entityId * 2 /* size_per_element */)
            + 1 /* table_offset */] = table;
    }
}
exports.EntityRecords = EntityRecords;
