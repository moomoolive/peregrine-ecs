import {SharedInt32Array} from "../dataStructures/veci32/index"
import {Component, ComponentDef} from "../components/index"

class TableWorkerMemory {
    length: number
    components: Component<ComponentDef>[]
    entities: Int32Array

    constructor(
        length: number, 
        components: Component<ComponentDef>[],  
        entities: Int32Array
    ) {
        this.length = length
        this.components = components
        this.entities = entities
    }
}

// the current implementation of the archetype
// graph could be significantly sped up
// by using an array for pre-built components
// check out the edge vector here: https://ajmmertens.medium.com/building-an-ecs-2-archetypes-and-vectorization-fe21690805f9
// archetype implementation here: https://github.com/SanderMertens/flecs/blob/v2.4.8/src/private_types.h#L170
// archetype graph implemenation here: https://github.com/SanderMertens/flecs/blob/v2.4.8/src/table_graph.c#L192
export class Table {
    /**
     * The components a given entity 
     * in this table possesses. 
     * 
     * This orders component ids in
     * ascending order, and should be used
     */
    type: Int32Array

    /**
     * This is identical to the `type` field except that
     * component ids are unordered here, so it's 
     * not ideal for queries.
     * 
     * The actual component can be found at the same
     * index in as it's corresponding id 
     * the `workerMemory.components` field
     */
    componentRef: Int32Array
    
    removeEdges: Map<number, Table>
    addEdges: Map<number, Table>
    
    /**
     * The part of a table that is meant 
     * to be passed between workers.
     * 
     * This subsection of a table costs
     * virtually nothing to pass across threads
    */
    workerMemory: TableWorkerMemory

    constructor() {
        this.workerMemory = new TableWorkerMemory(
            0, 
            [], 
            SharedInt32Array(1)
        )

        this.type = SharedInt32Array(1)
        this.componentRef = SharedInt32Array(1)
        this.addEdges = new Map()
        this.removeEdges = new Map()
    }
}
