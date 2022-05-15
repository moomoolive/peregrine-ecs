import {
    ComponentsDeclaration,
    ComponentViews
} from "../components/index"
import {
    EntityRecords,
    encoding as entity_encoding
} from "./index"
import {
    Table,
    computeNewTableHashAdditionalTag,
    table_hashes
} from "../table/index"
import {relation} from "../entities/idCreators"
import {Allocator} from "../allocator/index"
import {bytes} from "../consts"

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
    tableHashes: Map<string, number>
    componentAllocator: Allocator
    componentClasses: ComponentViews

    constructor(
        records: EntityRecords,
        tables: Table[],
        databuffer: Float64Array,
        tableHashes: Map<string, number>,
        componentAllocator: Allocator,
        componentClasses: ComponentViews
    ) {
        this.records = records
        this.tables = tables
        this.databuffer = databuffer
        this.tableHashes = tableHashes
        this.componentAllocator = componentAllocator
        this.componentClasses = componentClasses
    }


    addTag(
        entityId: number,
        tagId: number
    ): MutatorStatusCode {
        /*
        const records = this.records
        const tablePtr = records.tablePtrs[entityId]
        if (tablePtr === entity_encoding.unintialized) {
            return status_codes.entity_uninitialized
        }
        const table = this.tables[tablePtr]
        //if tag already exists on table, do nothing
        if (table.componentIndexes.has(tagId)) {
            return status_codes.tag_exists
        }
        
        let targetTable: Table | undefined = table.addEdges.get(tagId)
         
        //if tag doesn't exist in current table, 
        //find it via the add edges or create it 
        if (!targetTable) {
            const {
                hash, 
                insertIndex
            } = computeNewTableHashAdditionalTag(
                table.componentIds,
                tagId,
                // subject to change?
                table.components.length
            )
            const nextTable = this.tableHashes.get(hash)
            // check if table has already been created
            if (nextTable) {
                targetTable = nextTable
            } else {
                const length = table.componentIds.length + 1
                const newTableComponentIds_ptr = this.componentAllocator.malloc(
                    length * bytes.i32
                )
                const newTableComponents = new Int32Array(
                    this.componentAllocator.buf,
                    newTableComponentIds_ptr,
                    length
                )
                newTableComponents.set(table.componentIds)
                if (insertIndex === table_hashes.last_index) {
                    newTableComponents[length - 1] = tagId
                } else {
                    newTableComponents.copyWithin(
                        insertIndex + 1,
                        insertIndex,
                        length
                    )
                    newTableComponents[insertIndex] = tagId
                }
                const componentData = []
                const initialCapacity = 1
                for (let i = 0; i < table.orderedComponents.length; i ++) {
                    const componentId = table.componentIds[i]
                    const constructor = this.componentClasses[componentId]
                    componentData.push(
                        new constructor(
                            initialCapacity, 
                            this.componentAllocator
                        )
                    )
                }
                targetTable = new Table(
                    hash, initialCapacity,
                    newTableComponents,
                    newTableComponentIds_ptr,
                    componentData, this.componentAllocator
                )
                this.tables.push(targetTable)
            }
            table.addEdges.set(tagId, targetTable)
        }

        
        //proceed to move entity data from current table to 
        //target table, (identical components, tags + new) 
        
        const entityRow = records.row[entityId]
        for (let i = 0; i < table.orderedComponents.length; i++) {
            const currentComponent = table.orderedComponents[i]
            const targetComponent = targetTable.orderedComponents[i]
            for (let x = 0; x < currentComponent.databuffers.length; x++) {
                
                //there should be a method like 
                //"push" for tables
                
                currentComponent.databuffers[x][entityRow] = (
                    targetComponent.databuffers[x][0]
                )
                currentComponent.databuffers[x][entityRow] = (
                    currentComponent.databuffers[x][table.trueLength - 1]
                )
            }
        }
        table.entities[entityRow] = table.entities[table.trueLength - 1]
        table.trueLength--
        targetTable.trueLength++
        */
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