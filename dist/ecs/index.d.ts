import { Veci32 } from "../dataStructures/veci32/index";
import { Table } from "../table/index";
import { EntityRecord } from "../entities/index";
import { ComponentRegistry } from "../dataStructures/registries/index";
import { ComponentsDeclaration, ComponentClasses } from "../components/index";
import { Debugger } from "./debugger";
import { EntityMutator } from "../entities/mutator";
export declare class BaseEcs<T extends ComponentsDeclaration> {
    /** entity ids that were recycled or not used yet */
    protected _unusedEntityIds: Veci32;
    /** which archetype and row an entity resides in */
    protected _entityRecords: EntityRecord[];
    /** a table holds entities that have the exact same components */
    protected _tables: Table[];
    readonly components: ComponentRegistry<T>;
    protected readonly _componentClasses: ComponentClasses;
    readonly debugger: Debugger;
    private readonly _mutator;
    constructor(params: {
        components: ComponentRegistry<T>;
        componentClasses: ComponentClasses;
    });
    updateEntity(entityId: number): EntityMutator;
}
export interface EcsClass<T extends ComponentsDeclaration> {
    new (): BaseEcs<T>;
}
export declare function defineEcs<T extends ComponentsDeclaration>(params: {
    readonly components: T;
}): EcsClass<T>;
//# sourceMappingURL=index.d.ts.map