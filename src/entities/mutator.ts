import {
    ComponentsDeclaration
} from "../components/index"
import {
    EntityRecords,
    encoding as entity_encoding
} from "./index"
import {Table} from "../table/index"
import {relation} from "../entities/idCreators"

export type MutatorStatusCode = (
    0 | 1 | 2 | 3
)

export const enum status_codes {
    entity_uninitialized = 1,
    successful_update = 0,
    tag_exists = 2,
    tag_does_not_exist = 3
}

export const enum encoding {
    component_id_size = 1,
    entity_id_size = 1,
    entity_id_index = 0,
    first_component_id_index = 1,
    first_component_data_index = 2
}

export class EntityMutator<
    Components extends ComponentsDeclaration
> {
    records: EntityRecords
    tables: Table[]
    databuffer: Float64Array
    $tablePtrs: Int32Array

    constructor(
        records: EntityRecords,
        tables: Table[],
        databuffer: Float64Array,
        tablePtrs: Int32Array
    ) {
        this.records = records
        this.tables = tables
        this.databuffer = databuffer
        this.$tablePtrs = tablePtrs
    }

    createTable(): Table {
        throw new Error("not implemented")
    }

    addTag(
        entityId: number,
        tagId: number
    ): MutatorStatusCode {
        const records = this.records
        const entityTablePtrId = records.tablePtrIds[entityId]
        if (entityTablePtrId === entity_encoding.unintialized) {
            return status_codes.entity_uninitialized
        }
        const tablePtr = this.$tablePtrs[entityTablePtrId]
        const table = this.tables[tablePtr]
        const tagIds = table.tagIds
        const componentsLen = tagIds.length
        for (let i = 0; i < componentsLen; i++) {
            /* if tag already exists on table, do nothing */
            if (tagIds[i] === tagId) {
                return status_codes.tag_exists
            }
        }
        /* if tag doesn't exist in current table, find it via the add edges or create it */
        let targetTable: Table | undefined = table.addEdges.get(tagId)
        if (!targetTable) {
            targetTable = this.createTable()
            table.addEdges.set(tagId, targetTable)
        }
        /* proceed to move entity data from current table to target table, (identical components, tags + new) */
        const entityRow = records.row[entityId]
        return status_codes.successful_update
    }

    addRelation(
        entityId: number,
        relationId: number,
        relatedEntityId: number
    ): MutatorStatusCode {
        return this.addTag(
            entityId, relation(relationId, relatedEntityId)
        )
    }

    removeTag(
        entityId: number, 
        tagId: number
    ): MutatorStatusCode {
        const records = this.records
        const entityTablePtrId = records.tablePtrIds[entityId]
        if (entityTablePtrId === entity_encoding.unintialized) {
            return status_codes.entity_uninitialized
        }
        const tablePtr = this.$tablePtrs[entityTablePtrId]
        const table = this.tables[tablePtr]
        const tagIds = table.tagIds
        const componentsLen = tagIds.length
        for (let i = 0; i < componentsLen; i++) {
            /* if tag exists on table, find the next table via remove edges or create it */
            if (tagIds[i] === tagId) {
                let targetTable: Table | undefined = table.removeEdges.get(tagId)
                if (!targetTable) {
                    targetTable = this.createTable()
                    table.removeEdges.set(tagId, targetTable)
                }
                /* proceed to move entity data from current table to target table, (identical components, tags - new) */
                const entityRow = records.row[entityId]
                return status_codes.successful_update
            }
        }
        /* if tag does not exist on table, do nothing */
        return status_codes.tag_does_not_exist
    }

    removeRelation(
        entityId: number,
        relationId: number,
        relatedEntityId: number
    ): MutatorStatusCode {
        return this.removeTag(
            entityId, relation(relationId, relatedEntityId)
        )
    }
}