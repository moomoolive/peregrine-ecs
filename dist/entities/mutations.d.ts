import { StructProxyClass, ComponentDefinition } from "../components/index";
import { Table } from "../table/index";
import { Allocator } from "../allocator/index";
export declare type EntityMutationStatus = (-3 | -2 | -1 | 0 | 1 | 2 | 3 | 4);
export declare const enum entity_mutation_status {
    not_component = -3,
    entity_immutable = -2,
    entity_uninitialized = -1,
    successful_added = 0,
    tag_exists = 1,
    component_exists = 1,
    relationship_exists = 1,
    successfully_deleted = 2,
    tag_not_found = 3,
    component_not_found = 3,
    relationship_not_found = 3,
    successfully_removed = 4
}
export declare function findTableOrCreateAddTag(tableHashes: Map<string, number>, previousTable: Table, tagId: number, tables: Table[], allocator: Allocator): Table;
export declare function findTableOrCreateRemoveTag(tableHashes: Map<string, number>, previousTable: Table, tagId: number, tables: Table[], allocator: Allocator): Table;
export declare function shiftComponentDataAligned(source: Table, destination: Table, sourceRow: number, allocator: Allocator): number;
export declare function findTableOrCreateAddComponent(tableHashes: Map<string, number>, previousTable: Table, componentId: number, tables: Table[], allocator: Allocator, proxyClass: StructProxyClass<ComponentDefinition>): Table;
export declare function shiftComponentDataUnaligned(source: Table, destination: Table, sourceRow: number, allocator: Allocator, unalignedIndex: number, add: boolean): number;
export declare function findTableOrCreateRemoveComponent(tableHashes: Map<string, number>, previousTable: Table, componentId: number, tables: Table[], allocator: Allocator): Table;
//# sourceMappingURL=mutations.d.ts.map