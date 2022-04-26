import { Veci32 } from "../dataStructures/veci32/index";
import { Table } from "../table/index";
import { EntityRecord } from "../entities/index";
import { ComponentRegistry } from "../dataStructures/registries/index";
import { ComponentsDeclaration, ComponentClasses } from "../components/index";
export declare class Ecs<T extends ComponentsDeclaration> {
    /** entity ids that were recycled or not used yet */
    protected _unusedEntityIds: Veci32;
    /** which archetype and row an entity resides in */
    protected _entityRecords: EntityRecord[];
    /** a table holds entities that have the exact same components */
    protected _tables: Table[];
    readonly components: ComponentRegistry<T>;
    protected readonly componentClasses: ComponentClasses;
    constructor(params: {
        components: ComponentRegistry<T>;
        componentClasses: ComponentClasses;
    });
}
export declare function defineEcs<T extends ComponentsDeclaration>(params: {
    readonly components: T;
}): Ecs<T>;
//# sourceMappingURL=index.d.ts.map