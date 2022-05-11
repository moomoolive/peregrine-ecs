import { RawComponent, ComponentDef } from "../components/index";
import { Allocator } from "../allocator/index";
export declare const enum encoding {
    meta_size = 5,
    length_index = 0,
    capacity_index = 1,
    meta_ptr_index = 2,
    component_ids_ptr_index = 3,
    tag_ids_ptr_index = 4
}
export declare class Table {
    componentIds: Int32Array;
    components: RawComponent<ComponentDef>[];
    tagIds: Int32Array;
    removeEdges: Map<number, Table>;
    addEdges: Map<number, Table>;
    meta: Int32Array;
    length: number;
    constructor(initialCapacity: number, componentIds: Int32Array, componentIds_ptr: number, tagIds: Int32Array, tagIds_ptr: number, components: RawComponent<ComponentDef>[], globalAllocator: Allocator);
}
export declare function getTrueLength(tableMeta: Int32Array): number;
export declare function getCapacity(tableMeta: Int32Array): number;
export declare function get$metaPtr(tableMeta: Int32Array): number;
export declare function get$componentIdsPtr(tableMeta: Int32Array): number;
export declare function get$tagIdsPtr(tableMeta: Int32Array): number;
//# sourceMappingURL=index.d.ts.map