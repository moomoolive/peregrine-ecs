import { VecClass } from "struct-vec";
import { Archetype } from "./archetypes";
import { EntityIdContainer } from "./components";
import { EntityRecord } from "./entities";
export declare class Ecs {
    entityIndex: Map<number, EntityRecord>;
    unusedIds: EntityIdContainer;
    componentClasses: VecClass<any>[];
    archetypes: Archetype[];
    systems: Function[];
    constructor();
}
//# sourceMappingURL=index.d.ts.map