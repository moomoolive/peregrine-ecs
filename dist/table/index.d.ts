import { Allocator } from "../allocator/index";
import { RawComponent, ComponentDefinition } from "../components/index";
export declare const enum table_encoding {
    meta_size = 2,
    length_index = 0,
    capacity_index = 1
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
    ensureSize(additional: number, allocator: Allocator): void;
    private resizeComponents;
    reclaimMemory(allocator: Allocator): void;
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