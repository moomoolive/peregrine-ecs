import {
    RawComponent, 
    ComponentDef
} from "../components/index"
import {Allocator} from "../allocator/index"
import {bytes} from "../consts"

export const enum encoding {
    meta_size = 5,

    /* metadata members start */
    length_index = 0,
    capacity_index = 1,
    meta_ptr_index = 2,
    component_ids_ptr_index = 3,
    tag_ids_ptr_index = 4
    /* metadata members end */
}

// the current implementation of the archetype
// graph could be significantly sped up
// by using an array for pre-built components id ranges
// check out the edge vector here: https://ajmmertens.medium.com/building-an-ecs-2-archetypes-and-vectorization-fe21690805f9
// archetype implementation here: https://github.com/SanderMertens/flecs/blob/v2.4.8/src/private_types.h#L170
// archetype graph implemenation here: https://github.com/SanderMertens/flecs/blob/v2.4.8/src/table_graph.c#L192
export class Table {
    componentIds: Int32Array
    components: RawComponent<ComponentDef>[]
    tagIds: Int32Array
    removeEdges: Map<number, Table>
    addEdges: Map<number, Table>
    meta: Int32Array
    length: number

    constructor(
        initialCapacity: number,
        componentIds: Int32Array,
        componentIds_ptr: number,
        tagIds: Int32Array,
        tagIds_ptr: number,
        components: RawComponent<ComponentDef>[],
        globalAllocator: Allocator
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
        this.meta[encoding.tag_ids_ptr_index] = tagIds_ptr

        this.length = 0
        this.componentIds = componentIds
        this.tagIds = tagIds
        this.components = components
        this.addEdges = new Map()
        this.removeEdges = new Map()
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

export function get$tagIdsPtr(
    tableMeta: Int32Array
): number {
    return tableMeta[encoding.tag_ids_ptr_index]
}
