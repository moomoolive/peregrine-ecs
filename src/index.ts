import {EntityRecords} from "./entities/index"
import {
    Veci32, 
    SharedInt32Array
} from "./dataStructures/veci32/index"
import {
    Archetype
} from "./archetypes/index"

export class Ecs {
    protected _memory: {
        // ids/entity stuff
        unusedEntityIds: Veci32
        entityRecords: EntityRecords

        // component stuff
        componentRefs: Int32Array

        // archetype stuff
        unusedArchetypeRef: Veci32
        /**
         * ArchetypeRef is a sparse array that holds
         * indexes to the "archetypes" dense array.
         * 
         * This extra level of indirection is employed
         * while Int32Arrays are basically zero-cost
         * when passing between threads, references (objects)
         * are not. Additionally from benchmarking,
         * it seems that this extra level of indirection
         * doesn't add much overhead.
        */
        archetypeRefs: Veci32
        archetypes: Archetype[]
    }

    constructor() {
        this._memory = {
            unusedEntityIds: new Veci32(1),
            entityRecords: new EntityRecords(1),

            componentRefs: SharedInt32Array(1),
            
            unusedArchetypeRef: new Veci32(1),
            archetypeRefs: new Veci32(1),
            archetypes: []
        }
    }
}
