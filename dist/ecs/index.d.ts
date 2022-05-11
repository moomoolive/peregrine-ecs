import { Table } from "../table/index";
import { EntityRecords } from "../entities/index";
import { ComponentRegistry } from "../dataStructures/registries/index";
import { ComponentsDeclaration, ComponentClasses } from "../components/index";
import { Debugger } from "./debugger";
import { Allocator } from "../allocator/index";
export declare class BaseEcs<Components extends ComponentsDeclaration> {
    protected _unusedEntityIds: Int32Array;
    protected _entityRecords: EntityRecords;
    protected _tables: Table[];
    protected "&tablePtrs": Int32Array;
    protected _componentAllocator: Allocator;
    protected _mutatorDatabuffer: Float64Array;
    protected readonly _componentClasses: ComponentClasses;
    readonly components: ComponentRegistry<Components>;
    readonly debugger: Debugger;
    private _mutator;
    constructor(params: {
        componentClasses: ComponentClasses;
        componentRegistry: ComponentRegistry<Components>;
        maxEntities: number;
        allocatorInitialMemoryMB: number;
        stringifiedComponentDeclaration: string;
    });
}
export interface EcsClass<Components extends ComponentsDeclaration> {
    new (): BaseEcs<Components>;
}
export declare function defineEcs<Declaration extends ComponentsDeclaration>(params: {
    readonly components: Declaration;
    maxEntities?: number;
    allocatorInitialMemoryMB?: number;
}): EcsClass<Declaration>;
//# sourceMappingURL=index.d.ts.map