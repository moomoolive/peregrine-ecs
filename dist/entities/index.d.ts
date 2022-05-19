export declare const enum record_encoding {
    size_per_element = 2,
    table_id_offset = 1,
    row_offset = 0,
    unintialized = -1
}
export declare const enum component_entity_encoding {
    future_reserved_max_count = 512,
    max_count = 256
}
export declare const enum reserved_by_ecs_encoding {
    max_count = 50,
    tail_reservation = 10000
}
export declare const enum relation_entity_encoding {
    future_reserved_max_id = 4095,
    max_id = 2047,
    max_count = 1485,
    approx_max_count = 1400
}
export declare const enum standard_entity {
    reserved_start = 0,
    reserved_end = 50,
    reserved_count = 50,
    components_start = 50,
    components_end = 562,
    relations_start = 562,
    relations_end = 4095,
    start_of_user_defined_entities = 14095,
    ecs_id = 0,
    ecs_component = 1,
    ecs_root = 2
}
export declare const STANDARD_ENTITIES: readonly [standard_entity, standard_entity];
export declare const enum entities_encoding {
    limit = 500000,
    minimum = 5000
}
export declare class EntityRecords {
    protected records: Int32Array;
    protected _index: number;
    constructor(initialCapacity: number);
    init(): void;
    index(entityId: number): this;
    recordEntity(index: number, row: number, table: number): number;
    unsetEntity(index: number): number;
    get row(): number;
    set row(row: number);
    get tableId(): number;
    set tableId(table: number);
}
//# sourceMappingURL=index.d.ts.map