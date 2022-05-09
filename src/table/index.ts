import {
    RawComponent, 
    ComponentDef
} from "../components/index"
import {Allocator} from "../allocator/index"
import {Bytes} from "../consts"

// the current implementation of the archetype
// graph could be significantly sped up
// by using an array for pre-built components id ranges
// check out the edge vector here: https://ajmmertens.medium.com/building-an-ecs-2-archetypes-and-vectorization-fe21690805f9
// archetype implementation here: https://github.com/SanderMertens/flecs/blob/v2.4.8/src/private_types.h#L170
// archetype graph implemenation here: https://github.com/SanderMertens/flecs/blob/v2.4.8/src/table_graph.c#L192
export class Table {
    componentIds: Int32Array
    components: RawComponent<ComponentDef>[]
    removeEdges: Map<number, Table>
    addEdges: Map<number, Table>
    meta: Int32Array
    lazyLength: number

    constructor(
        initialCapacity: number,
        componentIds: Int32Array,
        componentIds_ptr: number,
        globalAllocator: Allocator
    ) {
        const meta_ptr = globalAllocator.malloc(3 * Bytes.i32)
        this.meta = new Int32Array(
            globalAllocator.buf,
            meta_ptr,
            4
        )
        this.meta[0] = 0
        this.meta[1] = initialCapacity
        this.meta[2] = meta_ptr
        this.meta[3] = componentIds_ptr

        this.lazyLength = 0
        this.componentIds = componentIds
        this.components = []
        this.addEdges = new Map()
        this.removeEdges = new Map()
    }

    get length(): number {
        return this.lazyLength
    }
    
    get trueLength(): number {
        return this.meta[0]
    }

    get capacity(): number {
        return this.meta[1]
    }

    get "&metaPtr"() {
        return this.meta[2]
    }

    get "&componentIdsPtr"() {
        return this.meta[3]
    }
}

export function updateTableLength(table: Table): Table {
    table.lazyLength = table.trueLength
    return table
}
