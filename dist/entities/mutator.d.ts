import { ComponentsDeclaration } from "../components/index";
import { EntityRecords } from "./index";
import { Table } from "../table/index";
export declare type MutatorStatusCode = (0 | 1 | 2 | 3);
export declare const enum status_codes {
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
export declare class EntityMutator<Components extends ComponentsDeclaration> {
    records: EntityRecords;
    tables: Table[];
    databuffer: Float64Array;
    $tablePtrs: Int32Array;
    constructor(records: EntityRecords, tables: Table[], databuffer: Float64Array, tablePtrs: Int32Array);
    createTable(): Table;
    addTag(entityId: number, tagId: number): MutatorStatusCode;
    addRelation(entityId: number, relationId: number, relatedEntityId: number): MutatorStatusCode;
    removeTag(entityId: number, tagId: number): MutatorStatusCode;
    removeRelation(entityId: number, relationId: number, relatedEntityId: number): MutatorStatusCode;
}
//# sourceMappingURL=mutator.d.ts.map