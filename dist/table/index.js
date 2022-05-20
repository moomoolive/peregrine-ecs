"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeNewTableHashAdditionalTag = exports.generateTableHash = exports.Table = exports.createTableMeta = void 0;
const index_1 = require("../allocator/index");
function createTableMeta(allocator) {
    return (0, index_1.i32Malloc)(allocator, 6 /* meta_size */);
}
exports.createTableMeta = createTableMeta;
// the current implementation of the archetype
// graph could be significantly sped up
// by using an array for pre-built components id ranges
// check out the edge vector here: https://ajmmertens.medium.com/building-an-ecs-2-archetypes-and-vectorization-fe21690805f9
// archetype implementation here: https://github.com/SanderMertens/flecs/blob/v2.4.8/src/private_types.h#L170
// archetype graph implemenation here: https://github.com/SanderMertens/flecs/blob/v2.4.8/src/table_graph.c#L192
class Table {
    constructor(id, hash, componentIds, components, meta, componentBufferPtrs, entities, initialCapacity) {
        this.id = id;
        this.hash = hash;
        this.meta = meta;
        this.capacity = initialCapacity;
        this.entitiesPtr = entities.byteOffset;
        this.entities = entities;
        this.componentBufferPtrs = componentBufferPtrs;
        this.componentBufferPtrsPtr = componentBufferPtrs.byteOffset;
        this.componentCount = components.length;
        this.componentIds = componentIds;
        this.componentIdsPtr = componentIds.byteOffset;
        const indexes = new Map();
        for (let i = 0; i < componentIds.length; i++) {
            const id = componentIds[i];
            indexes.set(id, i);
        }
        this.componentIndexes = indexes;
        this.components = components;
        this.addEdges = new Map();
        this.removeEdges = new Map();
    }
    get length() {
        return this.meta[0 /* length_index */];
    }
    set length(newLength) {
        this.meta[0 /* length_index */] = newLength;
    }
    get capacity() {
        return this.meta[1 /* capacity_index */];
    }
    set capacity(newCapacity) {
        this.meta[1 /* capacity_index */] = newCapacity;
    }
    get componentBufferPtrsPtr() {
        return this.meta[2 /* component_buffer_ptrs_ptr */];
    }
    set componentBufferPtrsPtr(newPtr) {
        this.meta[2 /* component_buffer_ptrs_ptr */] = newPtr;
    }
    get entitiesPtr() {
        return this.meta[3 /* entities_ptr */];
    }
    set entitiesPtr(newPtr) {
        this.meta[3 /* entities_ptr */] = newPtr;
    }
    get componentIdsPtr() {
        return this.meta[4 /* component_ids_ptr */];
    }
    set componentIdsPtr(newPtr) {
        this.meta[4 /* component_ids_ptr */] = newPtr;
    }
    get componentCount() {
        return this.meta[5 /* component_count */];
    }
    set componentCount(newPtr) {
        this.meta[5 /* component_count */] = newPtr;
    }
    get(component) {
        const arrIndex = this.componentIndexes.get(component);
        const components = this.components;
        if (!arrIndex || arrIndex > (components.length - 1)) {
            return;
        }
        return components[arrIndex];
    }
    has(componentId) {
        return this.componentIndexes.has(componentId) !== undefined;
    }
    ensureSize(additional, allocator) {
        const len = this.length;
        const capacity = this.capacity;
        if (len + additional <= capacity) {
            return len;
        }
        const targetCapacity = (capacity
            * 2 /* resize_factor */);
        this.resizeComponents(targetCapacity, allocator);
        return len;
    }
    resizeComponents(targetCapacity, allocator) {
        const components = this.components;
        const componentPtrs = this.componentBufferPtrs;
        for (let i = 0; i < components.length; i++) {
            const component = components[i];
            const oldPtr = componentPtrs[i];
            const newPtr = allocator.realloc(oldPtr, component.bytesPerElement * targetCapacity);
            component.databuffer = new component.memoryConstructor(allocator.buf, newPtr, targetCapacity);
            componentPtrs[i] = newPtr;
        }
        const oldEntitiesPtr = this.entitiesPtr;
        const newEntitiesPtr = allocator.realloc(oldEntitiesPtr, 4 /* i32 */ * targetCapacity);
        this.entities = new Int32Array(allocator.buf, newEntitiesPtr, targetCapacity);
        this.capacity = targetCapacity;
        this.entitiesPtr = this.entities.byteOffset;
    }
    reclaimMemory(allocator) {
        const len = this.length;
        const capacity = this.capacity;
        if (capacity - len < 50 /* memory_reclaimation_limit */) {
            return len;
        }
        const targetCapacity = (len + 50 /* memory_reclaimation_limit */);
        this.resizeComponents(targetCapacity, allocator);
        return len;
    }
    removeEntity(row) {
        const length = this.length;
        const lastEntity = length - 1;
        if (length === 1 || row === lastEntity) {
            this.length--;
            // garbage collection ??
            return true;
        }
        /* swap entity spots, to avoid expensive shifting */
        this.entities[row] = this.entities[lastEntity];
        const components = this.components;
        const len = components.length;
        for (let c = 0; c < len; c++) {
            const { componentSegements, databuffer } = components[c];
            const rowOffset = row * componentSegements;
            const lastEntityOffset = lastEntity * componentSegements;
            for (let i = 0; i < componentSegements; i++) {
                /* swap bytes of last entity, with target row */
                databuffer[rowOffset + i] = databuffer[lastEntityOffset + i];
            }
        }
        this.length--;
        // garbage collection ??
        return true;
    }
}
exports.Table = Table;
function generateTableHash(componentIds, numberOfComponents) {
    let hash = "";
    for (let i = 0; i < numberOfComponents; i++) {
        hash += componentIds[i].toString();
    }
    hash += "&" /* tag_component_divider */;
    for (let i = numberOfComponents; i < componentIds.length; i++) {
        hash += componentIds[i].toString();
    }
    return hash;
}
exports.generateTableHash = generateTableHash;
let hashCarrier = { hash: "", insertIndex: 0 };
function computeNewTableHashAdditionalTag(referingTableComponentIds, tag, componentsLength) {
    let hash = "";
    /* compute section for components */
    for (let i = 0; i < componentsLength; i++) {
        hash += referingTableComponentIds[i].toString();
    }
    hash += "&" /* tag_component_divider */;
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
