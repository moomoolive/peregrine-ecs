import { EntityRecords } from "./entities/index";
import { Veci32 } from "./dataStructures/veci32/index";
import { Archetype } from "./archetypes/index";
export declare class Ecs {
    protected _memory: {
        unusedEntityIds: Veci32;
        entityRecords: EntityRecords;
        componentRefs: Int32Array;
        unusedArchetypeRef: Veci32;
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
        archetypeRefs: Veci32;
        archetypes: Archetype[];
    };
    constructor();
}
//# sourceMappingURL=index.d.ts.map