import { ComponentId } from "../ecs/debugging";
import { Table } from "../table/index";
declare type TablePublicFields = ("entities" | "get" | "has" | "hasRelationship" | "hasComponent");
export declare type PublicTable = Pick<Table, TablePublicFields>;
export declare class QueryManager {
    private termBuffer;
    private tableIterBuffer;
    private queryIndex;
    private termCount;
    private tables;
    constructor(termBuffer: Int32Array, tableIterBuffer: Int32Array, queryIndex: Map<number, Set<number>>, tables: Table[]);
    private reset;
    component(id: ComponentId): this;
    tag(id: number): this;
    relationship(relation: number, entity: number): this;
    iter(): Generator<{
        table: PublicTable;
        start: number;
        end: number;
    }>;
}
export {};
//# sourceMappingURL=manager.d.ts.map