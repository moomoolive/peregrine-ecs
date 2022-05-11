import {
    RawComponent, 
    ComponentDef
} from "../components/index"
import {Allocator} from "../allocator/index"
import {Bytes} from "../consts"

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
            encoding.meta_size * Bytes.i32
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
    
    get trueLength(): number {
        return this.meta[encoding.length_index]
    }

    get capacity(): number {
        return this.meta[encoding.capacity_index]
    }

    get $metaPtr() {
        return this.meta[encoding.meta_ptr_index]
    }

    get $componentIdsPtr() {
        return this.meta[encoding.component_ids_ptr_index]
    }

    get $tagIdsPtr() {
        return this.meta[encoding.tag_ids_ptr_index]
    }
}
