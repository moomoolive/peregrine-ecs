import { ComponentsDeclaration, StructProxyClasses } from "../components/index";
import { EntityRecords } from "./index";
import { Table } from "../table/index";
import { Allocator } from "../allocator/index";
export declare type MutatorStatusCode = (0 | 1 | 2 | 3);
export declare const enum mutation_status {
    entity_uninitialized = 1,
    successful_update = 0,
    tag_exists = 2,
    tag_does_not_exist = 3
}
export declare const enum encoding {
    component_id_size = 1,
    entity_id_size = 1,
    entity_id_index = 0,
    first_component_id_index = 1,
    first_component_data_index = 2
}
export declare function findTableOrCreate(tableHashes: Map<string, number>, previousTable: Table, tagId: number, tables: Table[], allocator: Allocator, componentViews: StructProxyClasses): Table;
export declare function shiftComponentDataAligned(source: Table, destination: Table, sourceRow: number, allocator: Allocator): number;
export declare function addTagComponent(entityId: number, tagId: number, records: EntityRecords, tables: Table[], tableHashes: Map<string, number>, allocator: Allocator, componentViews: StructProxyClasses): MutatorStatusCode;
export declare class EntityMutator<Components extends ComponentsDeclaration> {
    records: EntityRecords;
    tables: Table[];
    databuffer: Float64Array;
    tableHashes: Map<string, number>;
    componentAllocator: Allocator;
    componentClasses: StructProxyClasses;
    constructor(records: EntityRecords, tables: Table[], databuffer: Float64Array, tableHashes: Map<string, number>, componentAllocator: Allocator, componentClasses: StructProxyClasses);
    addTag(entityId: number, tagId: number): MutatorStatusCode;
    addRelation(entityId: number, relationId: number, relatedEntityId: number): MutatorStatusCode;
    removeTag(entityId: number, tagId: number): MutatorStatusCode;
    removeRelation(entityId: number, relationId: number, relatedEntityId: number): MutatorStatusCode;
}
//# sourceMappingURL=mutator.d.ts.map