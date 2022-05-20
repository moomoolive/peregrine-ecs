import { StructProxyClasses } from "../components/index";
import { Table } from "../table/index";
import { Allocator } from "../allocator/index";
export declare type EntityMutationStatus = (-1 | 0 | 1 | 2 | 3 | 4);
export declare const enum entity_mutation_status {
    entity_uninitialized = -1,
    successful_added = 0,
    tag_exists = 1,
    successfully_deleted = 2,
    tag_not_found = 3,
    successfully_removed = 4
}
export declare function findTableOrCreate(tableHashes: Map<string, number>, previousTable: Table, tagId: number, tables: Table[], allocator: Allocator, componentViews: StructProxyClasses): Table;
export declare function findTableOrCreateRemoveHash(tableHashes: Map<string, number>, previousTable: Table, tagId: number, tables: Table[], allocator: Allocator, componentViews: StructProxyClasses): Table;
export declare function shiftComponentDataAligned(source: Table, destination: Table, sourceRow: number, allocator: Allocator): number;
//# sourceMappingURL=mutations.d.ts.map