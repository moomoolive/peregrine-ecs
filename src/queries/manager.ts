import {ComponentId} from "../ecs/debugging"
import {relationship} from "../entities/ids"
import {Table} from "../table/index"
import {createSharedInt32Array} from "../dataStructures/sharedArrays"

type TablePublicFields = (
    "entities"
    | "get"
    | "has"
    | "hasRelationship"
    | "hasComponent"
)

export type PublicTable = Pick<Table, TablePublicFields> 

export const enum query_encoding {
    terms_meta_data_size = 1,
    max_terms = 150,
    term_buffer_size = max_terms,
    max_queried_tables = 300
}

export const enum query_terms_encoding {
    term_count = 0,
    term_count_reset_value = 1,
    first_term = term_count_reset_value,
    second_term = first_term + 1
}

export class QueryManager {
    private termBuffer: Int32Array
    private tablePtrBuffer: Int32Array
    private queryIndex: Map<number, Set<number>>
    private tables: Table[]

    constructor(
        queryIndex: Map<number, Set<number>>,
        tables: Table[]
    ) {
        this.termBuffer = createSharedInt32Array(query_encoding.term_buffer_size)
        this.tablePtrBuffer = createSharedInt32Array(query_encoding.max_queried_tables) 
        this.queryIndex = queryIndex
        this.termCount = query_terms_encoding.term_count_reset_value
        this.tables = tables
    }

    private get termCount(): number {
        return this.termBuffer[query_terms_encoding.term_count]
    }

    private set termCount(value: number) {
        this.termBuffer[query_terms_encoding.term_count] = value
    }
    

    private reset(): this {
        this.termCount = query_terms_encoding.term_count_reset_value
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
        const firstTerm = terms[query_terms_encoding.first_term]
        const matchingTablesFirst = index.get(firstTerm)
        if (matchingTablesFirst === undefined) {
            return
        }

        let tableIndex = 0
        const tablePtrs = this.tablePtrBuffer
        for (const tableId of matchingTablesFirst) {
            tablePtrs[tableIndex] = tableId
            tableIndex++
        }

        for (let i = query_terms_encoding.second_term; i < len; i++) {
            const term = terms[i]
            const matchingTables = index.get(term)
            if (matchingTables === undefined) {
                return
            }
            let x = 0
            while (x < tableIndex) {
                const tableId = tablePtrs[x]
                if (matchingTables.has(tableId)) {
                    x++
                    continue
                }
                tablePtrs[x] = tablePtrs[tableIndex - 1]
                tableIndex--
            }
        }

        const tables = this.tables
        for (let i = 0; i < tableIndex; i++) {
            const tableId = tablePtrs[i]
            const table = tables[tableId]
            const start = 0
            const end = table.length
            yield {table, start, end}
        }
    }
}