"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryManager = void 0;
const ids_1 = require("../entities/ids");
const sharedArrays_1 = require("../dataStructures/sharedArrays");
class QueryManager {
    constructor(queryIndex, tables) {
        this.termBuffer = (0, sharedArrays_1.createSharedInt32Array)(150 /* term_buffer_size */);
        this.tablePtrBuffer = (0, sharedArrays_1.createSharedInt32Array)(300 /* max_queried_tables */);
        this.queryIndex = queryIndex;
        this.termCount = 1 /* term_count_reset_value */;
        this.tables = tables;
    }
    get termCount() {
        return this.termBuffer[0 /* term_count */];
    }
    set termCount(value) {
        this.termBuffer[0 /* term_count */] = value;
    }
    reset() {
        this.termCount = 1 /* term_count_reset_value */;
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
        const firstTerm = terms[1 /* first_term */];
        const matchingTablesFirst = index.get(firstTerm);
        if (matchingTablesFirst === undefined) {
            return;
        }
        let tableIndex = 0;
        const tablePtrs = this.tablePtrBuffer;
        for (const tableId of matchingTablesFirst) {
            tablePtrs[tableIndex] = tableId;
            tableIndex++;
        }
        for (let i = 2 /* second_term */; i < len; i++) {
            const term = terms[i];
            const matchingTables = index.get(term);
            if (matchingTables === undefined) {
                return;
            }
            let x = 0;
            while (x < tableIndex) {
                const tableId = tablePtrs[x];
                if (matchingTables.has(tableId)) {
                    x++;
                    continue;
                }
                tablePtrs[x] = tablePtrs[tableIndex - 1];
                tableIndex--;
            }
        }
        const tables = this.tables;
        for (let i = 0; i < tableIndex; i++) {
            const tableId = tablePtrs[i];
            const table = tables[tableId];
            const start = 0;
            const end = table.length;
            yield { table, start, end };
        }
    }
}
exports.QueryManager = QueryManager;
