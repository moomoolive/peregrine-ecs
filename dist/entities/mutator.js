"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityMutator = void 0;
class EntityMutator {
    constructor(records, tables) {
        this.records = records;
        this.tables = tables;
    }
    createTable() {
        throw new Error("not implemented");
    }
    addComponent(entityId, componentId) {
        const { table, row } = this.records[entityId];
        // is this or using the row faster??
        if (table === null) {
            return 1 /* failed_update */;
        }
        const components = table.components;
        const len = components.length;
        for (let i = 0; i < len; i++) {
            /* if table already has component set the value to inputted */
            if (components[i] === componentId) {
                table.workerMemory.components[i]; //.set(row, databuffer)
                return 0 /* successful_update */;
            }
        }
        /* if table doesn't have component on it, we must move entity to new table */
        let targetTable = table.addEdges.get(componentId);
        if (targetTable === undefined) {
            targetTable = this.createTable();
            table.addEdges.set(componentId, targetTable);
        }
        /* move all component data to target table */
        return 0 /* successful_update */;
    }
    removeComponent(entityId, componentId) {
        const { table, row } = this.records[entityId];
        // is this or using the row faster??
        if (table === null) {
            return 1 /* failed_update */;
        }
        const components = table.components;
        const len = components.length;
        for (let i = 0; i < len; i++) {
            /* if table has component then we need to move entity to table that doesn't have it */
            if (components[i] === componentId) {
                let targetTable = table.removeEdges.get(componentId);
                if (targetTable === undefined) {
                    targetTable = this.createTable();
                    table.removeEdges.set(componentId, targetTable);
                }
                /* move all component data to target table */
                return 0 /* successful_update */;
            }
        }
        /* if table doesn't have component, then it cannot be removed */
        return 1 /* failed_update */;
    }
}
exports.EntityMutator = EntityMutator;
