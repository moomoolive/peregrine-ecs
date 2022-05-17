import {
    Allocator
} from "../allocator/index"
import {
    RawComponent, 
    ComponentDefinition
} from "../components/index"
import {bytes} from "../consts"

export const enum table_encoding {
    meta_size = 5,

    /* metadata members start */
    length_index = 0,
    capacity_index = 1,
    component_buffer_ptrs_ptr = 2,
    entities_ptr = 3,
    component_ids_ptr = 4
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
        this.id = id
        this.hash = hash

        this.meta = meta
        this.capacity = table_defaults.initial_capacity
        
        this.entitiesPtr = entities.byteOffset
        this.entities = entities
        
        this.componentBufferPtrs = componentBufferPtrs
        this.componentBufferPtrsPtr = componentBufferPtrs.byteOffset

        this.componentIds = componentIds
        this.componentIdsPtr = componentIds.byteOffset
        const indexes = new Map()
        for (let i = 0; i < componentIds.length; i++) {
            const id = componentIds[i]
            indexes.set(id, i)
        }
        this.componentIndexes = indexes

        this.components = components
        this.addEdges = new Map()
        this.removeEdges = new Map()
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

    get componentBufferPtrsPtr(): number{
        return this.meta[table_encoding.component_buffer_ptrs_ptr]
    }

    set componentBufferPtrsPtr(newPtr: number) {
        this.meta[table_encoding.component_buffer_ptrs_ptr] = newPtr
    }

    get entitiesPtr(): number{
        return this.meta[table_encoding.entities_ptr]
    }

    set entitiesPtr(newPtr: number) {
        this.meta[table_encoding.entities_ptr] = newPtr
    }

    get componentIdsPtr(): number{
        return this.meta[table_encoding.component_ids_ptr]
    }

    set componentIdsPtr(newPtr: number) {
        this.meta[table_encoding.component_ids_ptr] = newPtr
    }

    ensureSize(
        additional: number, 
        allocator: Allocator
    ): number {
        const len = this.length
        const capacity = this.capacity
        if (len + additional <= capacity) {
            return len
        }
        const targetCapacity = (
            capacity 
            * table_defaults.resize_factor
        )
        this.resizeComponents(targetCapacity, allocator)
        return len
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
        const oldEntitiesPtr = this.entitiesPtr
        const newEntitiesPtr = allocator.realloc(
            oldEntitiesPtr, bytes.i32 * targetCapacity
        )
        this.entities = new Int32Array(
            allocator.buf, newEntitiesPtr, targetCapacity
        )
        this.capacity = targetCapacity
        this.entitiesPtr = this.entities.byteOffset
    }

    reclaimMemory(allocator: Allocator): number {
        const len = this.length
        const capacity = this.capacity
        if (capacity - len < table_defaults.memory_reclaimation_limit) {
            return len
        }
        const targetCapacity = (
            len + table_defaults.memory_reclaimation_limit
        )
        this.resizeComponents(targetCapacity, allocator)
        return len
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
