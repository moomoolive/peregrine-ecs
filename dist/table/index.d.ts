import { RawComponent, ComponentDefinition } from "../components/index";
import { Allocator } from "../allocator/index";
export declare const enum encoding {
    meta_size = 4,
    length_index = 0,
    capacity_index = 1,
    meta_ptr_index = 2,
    component_ids_ptr_index = 3
}
export declare class Table {
    id: string;
    componentIds: Int32Array;
    orderedComponents: RawComponent<ComponentDefinition>[];
    components: RawComponent<ComponentDefinition>[];
    componentIndexes: Map<number, number>;
    removeEdges: Map<number, Table>;
    addEdges: Map<number, Table>;
    meta: Int32Array;
    length: number;
    entities: Int32Array;
    constructor(id: string, initialCapacity: number, componentIds: Int32Array, componentIds_ptr: number, components: RawComponent<ComponentDefinition>[], globalAllocator: Allocator);
    get trueLength(): number;
    set trueLength(newLength: number);
}
export declare function getTrueLength(tableMeta: Int32Array): number;
export declare function getCapacity(tableMeta: Int32Array): number;
export declare function get$metaPtr(tableMeta: Int32Array): number;
export declare function get$componentIdsPtr(tableMeta: Int32Array): number;
export declare const enum table_hashes {
    tag_component_divider = "-",
    last_index = -1
}
export declare function computeNewTableHashAdditionalTag(referingTableComponentIds: Int32Array, tag: number, componentsLength: number): {
    hash: string;
    insertIndex: number;
};
//# sourceMappingURL=index.d.ts.map