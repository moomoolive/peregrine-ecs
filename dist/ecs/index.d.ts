import { Table } from "../table/index";
import { EntityRecords } from "../entities/index";
import { ComponentRegistry } from "../dataStructures/registries/index";
import { ComponentsDeclaration, ComponentViews } from "../components/index";
import { Debugger } from "./debugger";
import { MutatorStatusCode } from "../entities/mutator";
import { Allocator } from "../allocator/index";
export declare type EcsMode = "development" | "production";
export declare class BaseEcs {
    protected unusedEntities: Int32Array;
    protected unusedEntityCount: number;
    protected entityRecords: EntityRecords;
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
        mode: EcsMode;
    });
    init(): Promise<void>;
    addTag(entityId: number, tagId: number): MutatorStatusCode;
}
export declare type Ecs<Components extends ComponentsDeclaration> = (BaseEcs & {
    readonly components: ComponentRegistry<Components>;
    readonly componentSchemas: Components;
});
export declare function defineEcs<Components extends ComponentsDeclaration>(params: {
    readonly components: Components;
}, { maxEntities, allocatorInitialMemoryMB, mode }?: {
    maxEntities?: number;
    allocatorInitialMemoryMB?: number;
    mode?: EcsMode;
}): Ecs<Components>;
//# sourceMappingURL=index.d.ts.map