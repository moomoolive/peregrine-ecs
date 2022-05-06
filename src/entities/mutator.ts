import type {BaseEcs} from "../ecs/index"
import {
    ComponentsDeclaration
} from "../components/index"
import {
    EntityRecord,
    encoding
} from "./index"
import {Table} from "../table/index"

export const enum statusCodes {
    failed_update = 1,
    successful_update = 0
}

export class EntityMutator {
    records: EntityRecord[]
    tables: Table[]

    constructor(
        records: EntityRecord[],
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
        const {table, row} = this.records[entityId]
        // is this or using the row faster??
        if (table === null) {
            return statusCodes.failed_update
        }
        const components = table.components
        const len = components.length
        for (let i = 0; i < len; i++) {
            /* if table already has component set the value to inputted */
            if (components[i] === componentId) {
                table.workerMemory.components[i]//.set(row, databuffer)
                return statusCodes.successful_update
            }
        }
        /* if table doesn't have component on it, we must move entity to new table */
        let targetTable = table.addEdges.get(componentId)
        if (targetTable === undefined) {
            targetTable = this.createTable()
            table.addEdges.set(componentId, targetTable)
        }
        /* move all component data to target table */
        return statusCodes.successful_update
    }

    removeComponent(
        entityId: number, 
        componentId: number
    ): 0 | 1 {
        const {table, row} = this.records[entityId]
        // is this or using the row faster??
        if (table === null) {
            return statusCodes.failed_update
        }
        const components = table.components
        const len = components.length
        for (let i = 0; i < len; i++) {
            /* if table has component then we need to move entity to table that doesn't have it */
            if (components[i] === componentId) {
                let targetTable = table.removeEdges.get(componentId)
                if (targetTable === undefined) {
                    targetTable = this.createTable()
                    table.removeEdges.set(componentId, targetTable)
                }
                /* move all component data to target table */
                return statusCodes.successful_update
            }
        }
        /* if table doesn't have component, then it cannot be removed */
        return statusCodes.failed_update
    }

    
}