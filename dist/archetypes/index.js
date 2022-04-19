"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Archetype = void 0;
const index_1 = require("../dataStructures/veci32/index");
class Archetype {
    constructor() {
        this.type = (0, index_1.SharedInt32Array)(1);
        this.entityIds = (0, index_1.SharedInt32Array)(1);
        this.components = [];
        this.length = 0;
        this.edges = [];
        this.refIndex = 0;
    }
}
exports.Archetype = Archetype;
// implmentation
// https://ajmmertens.medium.com/building-an-ecs-2-archetypes-and-vectorization-fe21690805f9
class ArchetypeEdge {
    constructor(add, remove) {
        this.add = add;
        this.remove = remove;
    }
}
