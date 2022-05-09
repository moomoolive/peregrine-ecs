"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
const sharedArrays_1 = require("../dataStructures/sharedArrays");
class TableWorkerMemory {
    constructor(length, capacity, components, entities) {
        this.length = length;
        this.capacity = capacity;
        this.components = components;
        this.entities = entities;
    }
}
// the current implementation of the archetype
// graph could be significantly sped up
// by using an array for pre-built components id ranges
// check out the edge vector here: https://ajmmertens.medium.com/building-an-ecs-2-archetypes-and-vectorization-fe21690805f9
// archetype implementation here: https://github.com/SanderMertens/flecs/blob/v2.4.8/src/private_types.h#L170
// archetype graph implemenation here: https://github.com/SanderMertens/flecs/blob/v2.4.8/src/table_graph.c#L192
class Table {
    constructor() {
        this.workerMemory = new TableWorkerMemory(0, 1, [], (0, sharedArrays_1.SharedInt32Array)(1));
        this.components = (0, sharedArrays_1.SharedUint8Array)(1);
        this.addEdges = new Map();
        this.removeEdges = new Map();
    }
}
exports.Table = Table;
