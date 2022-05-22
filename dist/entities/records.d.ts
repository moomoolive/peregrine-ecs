export declare const enum record_encoding {
    size_per_element = 3,
    row_offset = 0,
    table_id_offset = 1,
    generation_count_offset = 2,
    unintialized = -1
}
export declare function entityIsInitialized(tableId: number, generationCount: number, entityId: number): boolean;
export declare class EntityIndex {
    buffer: Int32Array;
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
    get generationCount(): number;
    set generationCount(table: number);
}
//# sourceMappingURL=records.d.ts.map