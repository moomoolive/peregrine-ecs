import { Allocator } from "../allocator/index";
import { RawComponent, ComponentDefinition } from "../components/index";
export declare const enum table_encoding {
    meta_size = 5,
    length_index = 0,
    capacity_index = 1,
    component_buffer_ptrs_ptr = 2,
    entities_ptr = 3,
    component_ids_ptr = 4
}
export declare const enum table_defaults {
    initial_capacity = 1,
    resize_factor = 2,
    memory_reclaimation_limit = 50
}
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
    constructor(id: number, hash: string, componentIds: Int32Array, components: RawComponent<ComponentDefinition>[], meta: Int32Array, componentBufferPtrs: Int32Array, entities: Int32Array);
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
    ensureSize(additional: number, allocator: Allocator): number;
    private resizeComponents;
    reclaimMemory(allocator: Allocator): number;
}
export declare const enum table_hashes {
    tag_component_divider = "-",
    last_index = -1
}
export declare function computeNewTableHashAdditionalTag(referingTableComponentIds: Int32Array, tag: number, componentsLength: number): {
    hash: string;
    insertIndex: number;
};
//# sourceMappingURL=index.d.ts.map