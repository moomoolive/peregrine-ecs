"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ecs = void 0;
const index_1 = require("./dataStructures/veci32/index");
class Ecs {
    constructor() {
        this._unusedEntityIds = new index_1.Veci32(1);
        this._entityRecords = [];
        this._tables = [];
    }
}
exports.Ecs = Ecs;
