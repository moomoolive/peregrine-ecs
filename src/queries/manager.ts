import {ComponentId} from "../ecs/debugging"
import {relationship} from "../entities/ids"
import {Table} from "../table/index"

type TablePublicFields = (
    "entities"
    | "get"
    | "has"
    | "hasRelationship"
    | "hasComponent"
)

export type PublicTable = Pick<Table, TablePublicFields> 

export class QueryManager {
    private termBuffer: Int32Array
    private tableIterBuffer: Int32Array
    private queryIndex: Map<number, Set<number>>
    private termCount: number
    private tables: Table[]

    constructor(
        termBuffer: Int32Array,
        tableIterBuffer: Int32Array,
        queryIndex: Map<number, Set<number>>,
        tables: Table[]
    ) {
        this.termBuffer = termBuffer
        this.tableIterBuffer = tableIterBuffer
        this.queryIndex = queryIndex
        this.termCount = 0
        this.tables = tables
    }

    private reset(): this {
        this.termCount = 0
        return this
    }

    component(id: ComponentId): this {
        const targetTerm = this.termCount++
        this.termBuffer[targetTerm] = id as number
        return this
    }

    tag(id: number): this {
        const targetTerm = this.termCount++
        this.termBuffer[targetTerm] = id as number
        return this
    }

    relationship(relation: number, entity: number): this {
        const targetTerm = this.termCount++
        const term = relationship(relation, entity)
        this.termBuffer[targetTerm] = term
        return this
    }

    *iter(): Generator<{
        table: PublicTable,
        start: number,
        end: number
    }> {
        const len = this.termCount
        if (len < 1) {
            return
        }
        const terms = this.termBuffer
        const index = this.queryIndex
        const firstTerm = terms[0]
        const matchingTablesFirst = index.get(firstTerm)
        if (matchingTablesFirst === undefined) {
            return
        }

        let tableIndex = 0
        const tableBuffer = this.tableIterBuffer
        for (const tableId of matchingTablesFirst) {
            tableBuffer[tableIndex] = tableId
            tableIndex++
        }

        for (let i = 1; i < len; i++) {
            const term = terms[i]
            const matchingTables = index.get(term)
            if (matchingTables === undefined) {
                return
            }
            let x = 0
            while (x < tableIndex) {
                const tableId = tableBuffer[x]
                if (matchingTables.has(tableId)) {
                    x++
                    continue
                }
                tableBuffer[x] = tableBuffer[tableIndex - 1]
                tableIndex--
            }
        }

        const tables = this.tables
        for (let i = 0; i < tableIndex; i++) {
            const tableId = tableBuffer[i]
            const table = tables[tableId]
            const start = 0
            const end = table.length
            yield {table, start, end}
        }
    }
}