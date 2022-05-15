import {
    RawComponent, 
    ComponentDefinition
} from "../components/index"
import {Allocator} from "../allocator/index"
import {bytes} from "../consts"

export const enum encoding {
    meta_size = 4,

    /* metadata members start */
    length_index = 0,
    capacity_index = 1,
    meta_ptr_index = 2,
    component_ids_ptr_index = 3
    /* metadata members end */
}

// the current implementation of the archetype
// graph could be significantly sped up
// by using an array for pre-built components id ranges
// check out the edge vector here: https://ajmmertens.medium.com/building-an-ecs-2-archetypes-and-vectorization-fe21690805f9
// archetype implementation here: https://github.com/SanderMertens/flecs/blob/v2.4.8/src/private_types.h#L170
// archetype graph implemenation here: https://github.com/SanderMertens/flecs/blob/v2.4.8/src/table_graph.c#L192
export class Table {
    id: string
    componentIds: Int32Array
    orderedComponents: RawComponent<ComponentDefinition>[]
    components: RawComponent<ComponentDefinition>[]
    componentIndexes: Map<number, number>
    removeEdges: Map<number, Table>
    addEdges: Map<number, Table>
    meta: Int32Array
    length: number

    /* to be created */
    entities: Int32Array

    constructor(
        id: string,
        initialCapacity: number,
        componentIds: Int32Array,
        componentIds_ptr: number,
        components: RawComponent<ComponentDefinition>[],
        globalAllocator: Allocator,
    ) {
        const meta_ptr = globalAllocator.malloc(
            encoding.meta_size * bytes.i32
        )
        this.meta = new Int32Array(
            globalAllocator.buf,
            meta_ptr,
            encoding.meta_size
        )
        this.meta[encoding.length_index] = 0
        this.meta[encoding.capacity_index] = initialCapacity
        this.meta[encoding.meta_ptr_index] = meta_ptr
        this.meta[encoding.component_ids_ptr_index] = componentIds_ptr

        this.id = id
        this.length = 0
        this.componentIds = componentIds
        this.orderedComponents = components
        this.components = components.slice()
        this.addEdges = new Map()
        this.removeEdges = new Map()
        this.entities = new Int32Array()

        this.componentIndexes = new Map()
        for (let i = 0; i < componentIds.length; i++) {
            const id = componentIds[i]
            this.componentIndexes.set(id, i)
        }
    }

    get trueLength(): number {
        return this.meta[encoding.length_index]
    }
    set trueLength(newLength: number) {
        this.meta[encoding.length_index] = newLength
    }
}

export function getTrueLength(
    tableMeta: Int32Array
): number {
    return tableMeta[encoding.length_index]
}

export function getCapacity(
    tableMeta: Int32Array
): number {
    return tableMeta[encoding.capacity_index]
}

export function get$metaPtr(
    tableMeta: Int32Array
): number {
    return tableMeta[encoding.meta_ptr_index]
}

export function get$componentIdsPtr(
    tableMeta: Int32Array
): number {
    return tableMeta[encoding.component_ids_ptr_index]
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
