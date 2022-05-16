import { Table } from "./index";
import { Allocator } from "../allocator/index";
import { EntityRecords } from "../entities/index";
export declare const enum std_tables {
    count = 2,
    ecs_id = 0,
    ecs_component = 1
}
export declare const ECS_ID_TABLE_HASH = "id-01";
export declare const ECS_COMPONENT_TABLE_HASH = "comp-01";
export declare function createDefaultTables(allocator: Allocator, records: EntityRecords, componentCount: number): Table[];
//# sourceMappingURL=standardTables.d.ts.map