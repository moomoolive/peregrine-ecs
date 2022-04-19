"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ecs = void 0;
const index_1 = require("./entities/index");
const index_2 = require("./dataStructures/veci32/index");
class Ecs {
    constructor() {
        this._memory = {
            unusedEntityIds: new index_2.Veci32(1),
            entityRecords: new index_1.EntityRecords(1),
            componentRefs: (0, index_2.SharedInt32Array)(1),
            unusedArchetypeRef: new index_2.Veci32(1),
            archetypeRefs: new index_2.Veci32(1),
            archetypes: []
        };
    }
}
exports.Ecs = Ecs;
