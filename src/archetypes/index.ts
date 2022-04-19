import {SharedInt32Array} from "../dataStructures/veci32/index"
import {Component, ComponentDef} from "../components/index"

export class Archetype {
    type: Int32Array
    entityIds: Int32Array
    components: Component<ComponentDef>[]
    length: number
    edges: ArchetypeEdge[]
    refIndex: number

    constructor() {
        this.type = SharedInt32Array(1)
        this.entityIds = SharedInt32Array(1)
        this.components = []
        this.length = 0
        this.edges = []
        this.refIndex = 0
    }
}

// implmentation
// https://ajmmertens.medium.com/building-an-ecs-2-archetypes-and-vectorization-fe21690805f9
class ArchetypeEdge {
    // right
    add: Archetype | null

    // left
    remove: Archetype | null

    constructor(
        add: Archetype | null,
        remove: Archetype | null 
    ) {
        this.add = add
        this.remove = remove
    }
}
