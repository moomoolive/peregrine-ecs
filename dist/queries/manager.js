"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryManager = void 0;
const ids_1 = require("../entities/ids");
class QueryManager {
    constructor(termBuffer, tableIterBuffer, queryIndex, tables) {
        this.termBuffer = termBuffer;
        this.tableIterBuffer = tableIterBuffer;
        this.queryIndex = queryIndex;
        this.termCount = 0;
        this.tables = tables;
    }
    reset() {
        this.termCount = 0;
        return this;
    }
    component(id) {
        const targetTerm = this.termCount++;
        this.termBuffer[targetTerm] = id;
        return this;
    }
    tag(id) {
        const targetTerm = this.termCount++;
        this.termBuffer[targetTerm] = id;
        return this;
    }
    relationship(relation, entity) {
        const targetTerm = this.termCount++;
        const term = (0, ids_1.relationship)(relation, entity);
        this.termBuffer[targetTerm] = term;
        return this;
    }
    *iter() {
        const len = this.termCount;
        if (len < 1) {
            return;
        }
        const terms = this.termBuffer;
        const index = this.queryIndex;
        const firstTerm = terms[0];
        const matchingTablesFirst = index.get(firstTerm);
        if (matchingTablesFirst === undefined) {
            return;
        }
        let tableIndex = 0;
        const tableBuffer = this.tableIterBuffer;
        for (const tableId of matchingTablesFirst) {
            tableBuffer[tableIndex] = tableId;
            tableIndex++;
        }
        for (let i = 1; i < len; i++) {
            const term = terms[i];
            const matchingTables = index.get(term);
            if (matchingTables === undefined) {
                return;
            }
            let x = 0;
            while (x < tableIndex) {
                const tableId = tableBuffer[x];
                if (matchingTables.has(tableId)) {
                    x++;
                    continue;
                }
                tableBuffer[x] = tableBuffer[tableIndex - 1];
                tableIndex--;
            }
        }
        const tables = this.tables;
        for (let i = 0; i < tableIndex; i++) {
            const tableId = tableBuffer[i];
            const table = tables[tableId];
            const start = 0;
            const end = table.length;
            yield { table, start, end };
        }
    }
}
exports.QueryManager = QueryManager;
