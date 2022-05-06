import { Table } from "../table/index";
export declare const enum encoding {
    no_archetype = -1
}
export declare class EntityRecord {
    table: Table | null;
    row: number;
    constructor(arch: Table | null, row: number);
}
//# sourceMappingURL=index.d.ts.map