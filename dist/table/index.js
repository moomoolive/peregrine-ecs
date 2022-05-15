"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeNewTableHashAdditionalTag = exports.get$componentIdsPtr = exports.get$metaPtr = exports.getCapacity = exports.getTrueLength = exports.Table = void 0;
// the current implementation of the archetype
// graph could be significantly sped up
// by using an array for pre-built components id ranges
// check out the edge vector here: https://ajmmertens.medium.com/building-an-ecs-2-archetypes-and-vectorization-fe21690805f9
// archetype implementation here: https://github.com/SanderMertens/flecs/blob/v2.4.8/src/private_types.h#L170
// archetype graph implemenation here: https://github.com/SanderMertens/flecs/blob/v2.4.8/src/table_graph.c#L192
class Table {
    constructor(id, initialCapacity, componentIds, componentIds_ptr, components, globalAllocator) {
        const meta_ptr = globalAllocator.malloc(4 /* meta_size */ * 4 /* i32 */);
        this.meta = new Int32Array(globalAllocator.buf, meta_ptr, 4 /* meta_size */);
        this.meta[0 /* length_index */] = 0;
        this.meta[1 /* capacity_index */] = initialCapacity;
        this.meta[2 /* meta_ptr_index */] = meta_ptr;
        this.meta[3 /* component_ids_ptr_index */] = componentIds_ptr;
        this.id = id;
        this.length = 0;
        this.componentIds = componentIds;
        this.orderedComponents = components;
        this.components = components.slice();
        this.addEdges = new Map();
        this.removeEdges = new Map();
        this.entities = new Int32Array();
        this.componentIndexes = new Map();
        for (let i = 0; i < componentIds.length; i++) {
            const id = componentIds[i];
            this.componentIndexes.set(id, i);
        }
    }
    get trueLength() {
        return this.meta[0 /* length_index */];
    }
    set trueLength(newLength) {
        this.meta[0 /* length_index */] = newLength;
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
let hashCarrier = { hash: "", insertIndex: 0 };
function computeNewTableHashAdditionalTag(referingTableComponentIds, tag, componentsLength) {
    let hash = "";
    /* compute section for components */
    for (let i = 0; i < componentsLength; i++) {
        hash += referingTableComponentIds[i].toString();
    }
    hash += "-" /* tag_component_divider */;
    /* compute section for tags */
    let insertIndex = -1 /* last_index */;
    const len = referingTableComponentIds.length - 1;
    const start = componentsLength - 1;
    for (let i = start; i < len; i++) {
        const nextTag = referingTableComponentIds[i + 1];
        if (nextTag > tag) {
            hash += tag.toString();
            insertIndex = i + 1;
        }
        hash += nextTag.toString();
    }
    /*
    if none of the tags where bigger than input tag, it means
    that input tag is the biggest tag now
    */
    hashCarrier.hash = hash;
    hashCarrier.insertIndex = insertIndex;
    return hashCarrier;
}
exports.computeNewTableHashAdditionalTag = computeNewTableHashAdditionalTag;
