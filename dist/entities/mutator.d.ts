import { EntityRecord } from "./index";
import { Table } from "../table/index";
export declare const enum statusCodes {
    failed_update = 1,
    successful_update = 0
}
export declare class EntityMutator {
    records: EntityRecord[];
    tables: Table[];
    constructor(records: EntityRecord[], tables: Table[]);
    createTable(): Table;
    addComponent(entityId: number, componentId: number): 0 | 1;
    removeComponent(entityId: number, componentId: number): 0 | 1;
}
//# sourceMappingURL=mutator.d.ts.map