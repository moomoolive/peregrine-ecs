import { ComponentRegistry } from "../dataStructures/registries/index";
import { ComponentsDeclaration } from "../components/index";
import { Debugger } from "./debugger";
import { MutatorStatusCode } from "../entities/mutator";
export declare type EcsMode = "development" | "production";
export declare type EcsOptions = {
    maxEntities: number;
    allocatorInitialMemoryMB: number;
    mode: "development" | "production";
};
export declare class Ecs<Components extends ComponentsDeclaration> {
    private unusedEntities;
    private unusedEntityCount;
    private entityRecords;
    private tables;
    private tableAllocator;
    private hashToTableIndex;
    private readonly componentStructProxies;
    private largestEntityId;
    readonly debug: Debugger<Components>;
    readonly components: ComponentRegistry<Components>;
    constructor(params: {
        readonly components: Components;
    }, { maxEntities, allocatorInitialMemoryMB, mode }?: Partial<EcsOptions>);
    get entityCount(): number;
    private addToBlankTable;
    newEntity(): number;
    addTag(entityId: number, tagId: number): MutatorStatusCode;
}
//# sourceMappingURL=index.d.ts.map