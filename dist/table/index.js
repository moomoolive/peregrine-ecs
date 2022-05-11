"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get$tagIdsPtr = exports.get$componentIdsPtr = exports.get$metaPtr = exports.getCapacity = exports.getTrueLength = exports.Table = void 0;
// the current implementation of the archetype
// graph could be significantly sped up
// by using an array for pre-built components id ranges
// check out the edge vector here: https://ajmmertens.medium.com/building-an-ecs-2-archetypes-and-vectorization-fe21690805f9
// archetype implementation here: https://github.com/SanderMertens/flecs/blob/v2.4.8/src/private_types.h#L170
// archetype graph implemenation here: https://github.com/SanderMertens/flecs/blob/v2.4.8/src/table_graph.c#L192
class Table {
    constructor(initialCapacity, componentIds, componentIds_ptr, tagIds, tagIds_ptr, components, globalAllocator) {
        const meta_ptr = globalAllocator.malloc(5 /* meta_size */ * 4 /* i32 */);
        this.meta = new Int32Array(globalAllocator.buf, meta_ptr, 5 /* meta_size */);
        this.meta[0 /* length_index */] = 0;
        this.meta[1 /* capacity_index */] = initialCapacity;
        this.meta[2 /* meta_ptr_index */] = meta_ptr;
        this.meta[3 /* component_ids_ptr_index */] = componentIds_ptr;
        this.meta[4 /* tag_ids_ptr_index */] = tagIds_ptr;
        this.length = 0;
        this.componentIds = componentIds;
        this.tagIds = tagIds;
        this.components = components;
        this.addEdges = new Map();
        this.removeEdges = new Map();
    }
}
exports.Table = Table;
function getTrueLength(tableMeta) {
    return tableMeta[0 /* length_index */];
}
exports.getTrueLength = getTrueLength;
function getCapacity(tableMeta) {
    return tableMeta[1 /* capacity_index */];
}
exports.getCapacity = getCapacity;
function get$metaPtr(tableMeta) {
    return tableMeta[2 /* meta_ptr_index */];
}
exports.get$metaPtr = get$metaPtr;
function get$componentIdsPtr(tableMeta) {
    return tableMeta[3 /* component_ids_ptr_index */];
}
exports.get$componentIdsPtr = get$componentIdsPtr;
function get$tagIdsPtr(tableMeta) {
    return tableMeta[4 /* tag_ids_ptr_index */];
}
exports.get$tagIdsPtr = get$tagIdsPtr;
