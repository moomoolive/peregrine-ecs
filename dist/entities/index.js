"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityRecords = void 0;
const index_1 = require("../dataStructures/veci32/index");
class EntityRecords {
    constructor(capacity) {
        this.archetype = (0, index_1.SharedInt32Array)(capacity);
        this.generationCount = (0, index_1.SharedInt32Array)(capacity);
        this.length = 0;
    }
    static expand(records, additional) {
        const capacity = records.archetype.length + additional;
        const archetype = (0, index_1.SharedInt32Array)(capacity);
        archetype.set(records.archetype, 0);
        const meta = (0, index_1.SharedInt32Array)(capacity);
        meta.set(records.generationCount, 0);
        records.archetype = archetype;
        records.generationCount = meta;
    }
}
exports.EntityRecords = EntityRecords;
