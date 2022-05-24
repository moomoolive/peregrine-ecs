import { Allocator } from "../allocator/index";
import { RawComponent, ComponentDefinition } from "../components/index";
import { ComponentId } from "../ecs/debugging";
export declare const enum table_encoding {
    meta_size = 6,
    length_index = 0,
    capacity_index = 1,
    component_buffer_ptrs_ptr = 2,
    entities_ptr = 3,
    component_ids_ptr = 4,
    component_count = 5
}
export declare function createTableMeta(allocator: Allocator): Int32Array;
export declare const enum table_defaults {
    initial_capacity = 1,
    resize_factor = 2,
    memory_reclaimation_limit = 50
}
export declare type TableMutationStatus = (0 | 1);
export declare const enum table_mutation_status {
    swap_ok = 0,
    swap_averted = 1
}
export declare type Component<Definition extends ComponentDefinition> = (Pick<RawComponent<Definition>, "databuffer" | "index">);
export declare class Table {
    id: number;
    hash: string;
    componentIds: Int32Array;
    components: RawComponent<ComponentDefinition>[];
    componentIndexes: Map<number, number>;
    componentBufferPtrs: Int32Array;
    removeEdges: Map<number, number>;
    addEdges: Map<number, number>;
    meta: Int32Array;
    entities: Int32Array;
    constructor(id: number, hash: string, componentIds: Int32Array, components: RawComponent<ComponentDefinition>[], meta: Int32Array, componentBufferPtrs: Int32Array, entities: Int32Array, initialCapacity: number);
    get length(): number;
    set length(newLength: number);
    get capacity(): number;
    set capacity(newCapacity: number);
    get componentBufferPtrsPtr(): number;
    set componentBufferPtrsPtr(newPtr: number);
    get entitiesPtr(): number;
    set entitiesPtr(newPtr: number);
    get componentIdsPtr(): number;
    set componentIdsPtr(newPtr: number);
    get componentCount(): number;
    set componentCount(newPtr: number);
    get<Definition extends ComponentDefinition>(component: number | Definition): Component<Definition> | null;
    hasRelationship(relation: number, entity: number): boolean;
    hasComponent(id: ComponentId): boolean;
    has(id: ComponentId): boolean;
    ensureSize(additional: number, allocator: Allocator): number;
    private resizeComponents;
    reclaimMemory(allocator: Allocator): number;
    removeEntity(row: number): TableMutationStatus;
}
//# sourceMappingURL=index.d.ts.map