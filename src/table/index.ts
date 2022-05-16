import {Allocator} from "../allocator/index"
import {
    RawComponent, 
    ComponentDefinition
} from "../components/index"

export const enum table_encoding {
    meta_size = 2,

    /* metadata members start */
    length_index = 0,
    capacity_index = 1,
    /* metadata members end */
}

export const enum table_defaults {
    initial_capacity = 1,
    resize_factor = 2,
    memory_reclaimation_limit = 50
}

// the current implementation of the archetype
// graph could be significantly sped up
// by using an array for pre-built components id ranges
// check out the edge vector here: https://ajmmertens.medium.com/building-an-ecs-2-archetypes-and-vectorization-fe21690805f9
// archetype implementation here: https://github.com/SanderMertens/flecs/blob/v2.4.8/src/private_types.h#L170
// archetype graph implemenation here: https://github.com/SanderMertens/flecs/blob/v2.4.8/src/table_graph.c#L192
export class Table {
    id: number
    hash: string
    componentIds: Int32Array
    components: RawComponent<ComponentDefinition>[]
    componentIndexes: Map<number, number>
    componentBufferPtrs: Int32Array
    removeEdges: Map<number, number>
    addEdges: Map<number, number>
    meta: Int32Array
    entities: Int32Array

    constructor(
        id: number,
        hash: string,
        componentIds: Int32Array,
        components: RawComponent<ComponentDefinition>[],
        meta: Int32Array,
        componentBufferPtrs: Int32Array,
        entities: Int32Array
    ) {
        this.meta = meta
        this.id = id
        this.hash = hash
        this.componentIds = componentIds
        this.componentBufferPtrs = componentBufferPtrs
        this.components = components
        this.addEdges = new Map()
        this.removeEdges = new Map()
        this.entities = entities

        const indexes = new Map()
        for (let i = 0; i < componentIds.length; i++) {
            const id = componentIds[i]
            indexes.set(id, i)
        }
        this.componentIndexes = indexes
    }

    get length(): number {
        return this.meta[table_encoding.length_index]
    }

    set length(newLength: number) {
        this.meta[table_encoding.length_index] = newLength
    }

    get capacity(): number {
        return this.meta[table_encoding.capacity_index]
    }

    set capacity(newCapacity: number) {
        this.meta[table_encoding.capacity_index] = newCapacity
    }

    ensureSize(
        additional: number, 
        allocator: Allocator
    ) {
        const capacity = this.capacity
        if (this.length + additional <= capacity) {
            return
        }
        const targetCapacity = (
            capacity 
            * table_defaults.resize_factor
        )
        this.resizeComponents(targetCapacity, allocator)
    }

    private resizeComponents(
        targetCapacity: number, 
        allocator: Allocator
    ) {
        const components = this.components
        const componentPtrs = this.componentBufferPtrs
        for (let i = 0; i < components.length; i++) {
            const component = components[i]
            const oldPtr = componentPtrs[i]
            const newPtr = allocator.realloc(
                oldPtr, component.bytesPerElement * targetCapacity
            )
            component.databuffer = new component.memoryConstructor(
                allocator.buf, newPtr, targetCapacity
            )
            componentPtrs[i] = newPtr
        }
    }

    reclaimMemory(allocator: Allocator) {
        const len = this.length
        const capacity = this.capacity
        if (capacity - len < table_defaults.memory_reclaimation_limit) {
            return
        }
        const targetCapacity = (
            len + table_defaults.memory_reclaimation_limit
        )
        this.resizeComponents(targetCapacity, allocator)
    }
}

export const enum table_hashes {
    tag_component_divider = "-",
    last_index = -1
}

let hashCarrier = {hash: "", insertIndex: 0}
export function computeNewTableHashAdditionalTag(
    referingTableComponentIds: Int32Array,
    tag: number,
    componentsLength: number
): {hash: string, insertIndex: number} {
    let hash = ""
    /* compute section for components */
    for (let i = 0; i < componentsLength; i++) {
        hash += referingTableComponentIds[i].toString()
    }
    hash += table_hashes.tag_component_divider
    
    /* compute section for tags */
    let insertIndex = table_hashes.last_index
    const len = referingTableComponentIds.length - 1
    const start = componentsLength - 1
    for (let i = start; i < len; i++) {
        const nextTag = referingTableComponentIds[i + 1]
        if (nextTag > tag) {
            hash += tag.toString()
            insertIndex = i + 1
        }
        hash += nextTag.toString()
    }
    /* 
    if none of the tags where bigger than input tag, it means
    that input tag is the biggest tag now 
    */
    hashCarrier.hash = hash
    hashCarrier.insertIndex = insertIndex
    return hashCarrier
}
