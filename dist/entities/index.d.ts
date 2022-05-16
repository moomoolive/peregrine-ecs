export declare const enum record_encoding {
    unintialized = -1,
    size_per_element = 2,
    table_offset = 1
}
export declare class EntityRecords {
    records: Int32Array;
    protected _index: number;
    constructor(initialCapacity: number);
    index(entityId: number): this;
    get row(): number;
    set row(row: number);
    get_row(entityId: number): number;
    set_row(entityId: number, row: number): void;
    get table(): number;
    set table(table: number);
    get_table(entityId: number): number;
    set_table(entityId: number, table: number): void;
}
//# sourceMappingURL=index.d.ts.map