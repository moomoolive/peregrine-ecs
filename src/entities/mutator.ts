import {
    ComponentsDeclaration
} from "../components/index"
import {
    EntityRecords
} from "./index"
import {Table} from "../table/index"

export const enum statusCodes {
    failed_update = 1,
    successful_update = 0
}

export class EntityMutator<
    Components extends ComponentsDeclaration
> {
    records: EntityRecords
    tables: Table[]

    constructor(
        records: EntityRecords,
        tables: Table[]
    ) {
        this.records = records
        this.tables = tables
    }

    createTable(): Table {
        throw new Error("not implemented")
    }

    addComponent(
        entityId: number, 
        componentId: number
    ): 0 | 1 {
        
        return statusCodes.successful_update
    }

    removeComponent(
        entityId: number, 
        componentId: number
    ): 0 | 1 {
        return statusCodes.failed_update
    }

    
}