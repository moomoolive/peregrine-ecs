import { ComponentId } from "../ecs/debugging";
import { Table } from "../table/index";
declare type TablePublicFields = ("entities" | "get" | "has" | "hasRelationship" | "hasComponent");
export declare type PublicTable = Pick<Table, TablePublicFields>;
export declare const enum query_encoding {
    terms_meta_data_size = 1,
    max_terms = 150,
    term_buffer_size = 150,
    max_queried_tables = 300
}
export declare const enum query_terms_encoding {
    term_count = 0,
    term_count_reset_value = 1,
    first_term = 1,
    second_term = 2
}
export declare class QueryManager {
    private termBuffer;
    private tablePtrBuffer;
    private queryIndex;
    private tables;
    constructor(queryIndex: Map<number, Set<number>>, tables: Table[]);
    private get termCount();
    private set termCount(value);
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