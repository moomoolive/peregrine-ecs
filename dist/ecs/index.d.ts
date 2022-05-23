import { relation_entity_encoding } from "../entities/index";
import { ComponentRegistry, registry_encoding, RelationRegisty, IdDeclaration, EntityRegistry } from "../dataStructures/registries/index";
import { ComponentsDeclaration, struct_proxy_encoding, ComponentDefinition, StructProxy } from "../components/index";
import { ComponentDebug, ComponentId } from "./debugging";
import { EntityMutationStatus } from "../entities/mutations";
export declare class Ecs<Components extends ComponentsDeclaration, Relations extends IdDeclaration, Entities extends IdDeclaration> {
    static readonly MAX_FIELDS_PER_COMPONENT = struct_proxy_encoding.max_fields;
    static readonly MAX_COMPONENTS: registry_encoding;
    static readonly MAX_RELATIONS: relation_entity_encoding;
    private unusedIndexes;
    private unusedIndexesCount;
    private largestIndex;
    private records;
    readonly entities: EntityRegistry<Entities>;
    readonly declaredEntities: Entities;
    readonly relations: RelationRegisty<Relations>;
    readonly declaredRelations: Relations;
    readonly relationsCount: number;
    private tables;
    private tableAllocator;
    private hashToTableIndex;
    readonly components: ComponentRegistry<Components>;
    private readonly componentStructProxies;
    private componentDebugInfo;
    readonly declaredComponents: Components;
    constructor(params: {
        readonly components: Components;
        readonly relations?: Relations;
        readonly entities?: Entities;
        maxEntities?: number;
        allocatorInitialMemoryMB?: number;
        mode?: "development" | "production";
    });
    private addToRootTable;
    newId(): number;
    hasId(entityId: number, id: number): boolean;
    hasComponent(entityId: number, componentId: ComponentId): boolean;
    isActive(entityId: number): boolean;
    addId(entityId: number, tagId: number): EntityMutationStatus;
    removeId(entityId: number, tagId: number): EntityMutationStatus;
    delete(entityId: number): EntityMutationStatus;
    addComponent(entityId: number, componentId: ComponentId): EntityMutationStatus;
    removeComponent(entityId: number, componentId: ComponentId): EntityMutationStatus;
    getComponent<Definition extends ComponentDefinition>(entityId: number, componentId: number | Definition): StructProxy<Definition> | null;
    "~all_components_info"(): ComponentDebug[];
    "~debug_component"(componentId: ComponentId): ComponentDebug;
    "~entity_index"(entityId: number): {
        table: number;
        index: number;
        row: number;
        id: number;
    };
    get "~preciseEntityCount"(): number;
    get "~entityCount"(): number;
    get "~componentCount"(): number;
}
//# sourceMappingURL=index.d.ts.map