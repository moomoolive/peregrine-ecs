import { StructProxyClasses } from "../components/index";
import { Table } from "../table/index";
import { Allocator } from "../allocator/index";
export declare type MutatorStatusCode = (0 | 1 | 2 | 3);
export declare const enum mutation_status {
    entity_uninitialized = 1,
    successful_update = 0,
    tag_exists = 2,
    tag_does_not_exist = 3
}
export declare function findTableOrCreate(tableHashes: Map<string, number>, previousTable: Table, tagId: number, tables: Table[], allocator: Allocator, componentViews: StructProxyClasses): Table;
export declare function shiftComponentDataAligned(source: Table, destination: Table, sourceRow: number, allocator: Allocator): number;
//# sourceMappingURL=mutator.d.ts.map