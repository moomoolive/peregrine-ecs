"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityRecords = void 0;
const sharedArrays_1 = require("../dataStructures/sharedArrays");
const ids_1 = require("./ids");
class EntityRecords {
    constructor(initialCapacity) {
        this.buffer = (0, sharedArrays_1.createSharedInt32Array)(initialCapacity * 3 /* size_per_element */);
        this._index = 0;
    }
    init() {
        this.buffer.fill(-1 /* unintialized */);
    }
    index(entityId) {
        this._index = (entityId * 3 /* size_per_element */);
        return this;
    }
    recordEntity(index, row, table) {
        const targetIndex = index * 3 /* size_per_element */;
        const tableIndex = targetIndex + 1 /* table_id_offset */;
        this.buffer[tableIndex] = table;
        const rowIndex = targetIndex + 0 /* row_offset */;
        this.buffer[rowIndex] = row;
        const generationIndex = targetIndex + 2 /* generation_count_offset */;
        /* if generation count is bigger than 63, reset to 0 */
        const generationCount = (0, ids_1.preserveSixBits)(this.buffer[generationIndex] + 1);
        this.buffer[generationIndex] = generationCount;
        return generationCount;
    }
    unsetEntity(index) {
        const targetIndex = index * 3 /* size_per_element */;
        const tableIndex = targetIndex + 1 /* table_id_offset */;
        this.buffer[tableIndex] = -1 /* unintialized */;
        const rowIndex = targetIndex + 0 /* row_offset */;
        this.buffer[rowIndex] = -1 /* unintialized */;
        return index;
    }
    get row() {
        return this.buffer[(this._index)];
    }
    set row(row) {
        this.buffer[(this._index)] = row;
    }
    get tableId() {
        return this.buffer[(this._index)
            + 1 /* table_id_offset */];
    }
    set tableId(table) {
        this.buffer[(this._index)
            + 1 /* table_id_offset */] = table;
    }
    get generationCount() {
        return this.buffer[(this._index)
            + 2 /* generation_count_offset */];
    }
    set generationCount(table) {
        this.buffer[(this._index)
            + 2 /* generation_count_offset */] = table;
    }
}
exports.EntityRecords = EntityRecords;
