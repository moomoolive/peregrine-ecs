"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityRecords = exports.STANDARD_ENTITIES = void 0;
const sharedArrays_1 = require("../dataStructures/sharedArrays");
exports.STANDARD_ENTITIES = [
    0 /* ecs_id */,
    1 /* ecs_component */,
];
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
    recordEntity(index, row, table) {
        const targetIndex = index * 2 /* size_per_element */;
        const tableIndex = targetIndex + 1 /* table_id_offset */;
        this.records[tableIndex] = table;
        const rowIndex = targetIndex + 0 /* row_offset */;
        this.records[rowIndex] = row;
        return index;
    }
    unsetEntity(index) {
        const targetIndex = index * 2 /* size_per_element */;
        const tableIndex = targetIndex + 1 /* table_id_offset */;
        this.records[tableIndex] = -1 /* unintialized */;
        const rowIndex = targetIndex + 0 /* row_offset */;
        this.records[rowIndex] = -1 /* unintialized */;
        return index;
    }
    get row() {
        return this.records[(this._index)];
    }
    set row(row) {
        this.records[(this._index)] = row;
    }
    get tableId() {
        return this.records[(this._index)
            + 1 /* table_id_offset */];
    }
    set tableId(table) {
        this.records[(this._index)
            + 1 /* table_id_offset */] = table;
    }
}
exports.EntityRecords = EntityRecords;
