"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityRecords = void 0;
const sharedArrays_1 = require("../dataStructures/sharedArrays");
class EntityRecords {
    constructor(initialCapacity) {
        this.tablePtrIds = (0, sharedArrays_1.createSharedInt32Array)(initialCapacity).fill(-1 /* unintialized */);
        this.row = (0, sharedArrays_1.createSharedInt32Array)(initialCapacity).fill(-1 /* unintialized */);
    }
}
exports.EntityRecords = EntityRecords;
