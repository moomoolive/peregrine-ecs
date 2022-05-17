export declare const enum record_encoding {
    unintialized = -1,
    size_per_element = 2,
    table_offset = 1,
    no_components_specified_yet = -2
}
export declare const enum standard_entity {
    reserved_end = 50,
    reserved_start = 0,
    reserved_count = 50,
    start_of_user_defined_entities = 4096,
    ecs_id = 0,
    ecs_component = 1
}
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
    allocateEntity(index: number, row: number, table: number): number;
    get row(): number;
    set row(row: number);
    get table(): number;
    set table(table: number);
}
//# sourceMappingURL=index.d.ts.map