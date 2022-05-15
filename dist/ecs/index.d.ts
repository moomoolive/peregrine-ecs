import { Table } from "../table/index";
import { EntityRecords } from "../entities/index";
import { ComponentRegistry } from "../dataStructures/registries/index";
import { ComponentsDeclaration, ComponentViews } from "../components/index";
import { Debugger } from "./debugger";
import { Allocator } from "../allocator/index";
export declare class BaseEcs {
    protected _unusedEntityIds: Int32Array;
    protected _entityRecords: EntityRecords;
    protected tables: Table[];
    protected tableAllocator: Allocator;
    protected _mutatorDatabuffer: Float64Array;
    protected hashToTableIndex: Map<string, number>;
    protected readonly componentViews: ComponentViews;
    readonly debugger: Debugger;
    private _mutator;
    constructor(params: {
        maxEntities: number;
        allocatorInitialMemoryMB: number;
        stringifiedComponentDeclaration: string;
    });
}
export declare type GeneratedEcs<Components extends ComponentsDeclaration> = (BaseEcs & {
    readonly components: ComponentRegistry<Components>;
});
export declare type EcsClass<Components extends ComponentsDeclaration> = {
    readonly componentSchemas: Components;
    new (): GeneratedEcs<Components>;
};
export declare function defineEcs<Components extends ComponentsDeclaration>(params: {
    readonly components: Components;
    maxEntities?: number;
    allocatorInitialMemoryMB?: number;
}): EcsClass<Components>;
//# sourceMappingURL=index.d.ts.map