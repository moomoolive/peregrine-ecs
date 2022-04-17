import { Vec } from "struct-vec";
import { EntityIdContainer } from "./components";
export declare type Archetype = {
    type: EntityIdContainer;
    entityIds: EntityIdContainer;
    components: Vec<any>[];
};
export declare function Archetype(typeCapacity: number, entityCapacity: number, components: Vec<any>[]): Archetype;
export declare function ID(): Archetype;
export declare function COMPONENT(): Archetype;
//# sourceMappingURL=archetypes.d.ts.map