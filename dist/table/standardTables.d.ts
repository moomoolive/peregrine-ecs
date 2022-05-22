import { Table } from "./index";
import { Allocator } from "../allocator/index";
import { EntityIndex } from "../entities/records";
export declare const enum standard_tables {
    count = 3,
    ecs_id = 0,
    ecs_component = 1,
    ecs_root_table = 2
}
export declare const ECS_ID_TABLE_HASH: string;
export declare const ECS_COMPONENT_TABLE_HASH: string;
export declare function ecsEntityTable(allocator: Allocator, records: EntityIndex, relationsCount: number): Table;
export declare function createDefaultTables(allocator: Allocator, records: EntityIndex, componentCount: number, relationsCount: number): {
    defaultTables: Table[];
};
//# sourceMappingURL=standardTables.d.ts.map