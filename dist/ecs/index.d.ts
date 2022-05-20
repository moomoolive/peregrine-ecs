import { relation_entity_encoding } from "../entities/index";
import { ComponentRegistry, registry_encoding, RelationRegisty, IdDeclaration } from "../dataStructures/registries/index";
import { ComponentsDeclaration, struct_proxy_encoding } from "../components/index";
import { ComponentDebug, ComponentId } from "./debugging";
import { MutatorStatusCode } from "../entities/mutator";
export declare type EcsMode = "development" | "production";
export declare type EcsOptions<Relations extends IdDeclaration> = {
    maxEntities: number;
    allocatorInitialMemoryMB: number;
    mode: "development" | "production";
    relations: Relations;
};
export declare class Ecs<Components extends ComponentsDeclaration, Relations extends IdDeclaration> {
    static readonly MAX_FIELDS_PER_COMPONENT = struct_proxy_encoding.max_fields;
    static readonly MAX_COMPONENTS: registry_encoding;
    static readonly MAX_RELATIONS: relation_entity_encoding;
    private unusedIds;
    private unusedIdsCount;
    private largestId;
    private records;
    readonly relations: RelationRegisty<Relations>;
    readonly declaredRelations: Relations;
    private tables;
    private tableAllocator;
    private hashToTableIndex;
    readonly components: ComponentRegistry<Components>;
    private readonly componentStructProxies;
    private componentDebugInfo;
    readonly schemas: Components;
    constructor(params: {
        readonly components: Components;
    }, { maxEntities, allocatorInitialMemoryMB, mode, relations }?: Partial<EcsOptions<Relations>>);
    get entityCount(): number;
    get preciseEntityCount(): number;
    get componentCount(): number;
    get relationsCount(): number;
    allComponentDebugInfo(): ComponentDebug[];
    debugComponent(componentId: ComponentId): ComponentDebug;
    private addToBlankTable;
    newId(): number;
    hasId(entityId: number, id: number): boolean;
    isAlive(entityId: number): boolean;
    delete(entityId: number): boolean;
    addTag(entityId: number, tagId: number): MutatorStatusCode;
}
//# sourceMappingURL=index.d.ts.map