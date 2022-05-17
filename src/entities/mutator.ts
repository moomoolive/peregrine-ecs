import {
    ComponentsDeclaration,
    StructProxyClasses,
    RawComponent,
} from "../components/index"
import {
    EntityRecords,
    record_encoding
} from "./index"
import {
    Table,
    computeNewTableHashAdditionalTag,
    table_hashes,
    table_encoding,
    table_defaults,
} from "../table/index"
import {relation} from "../entities/idCreators"
import {
    Allocator,
    i32Malloc
} from "../allocator/index"

export type MutatorStatusCode = (
    0 | 1 | 2 | 3
)

export const enum mutation_status {
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

export function findTableOrCreate(
    tableHashes: Map<string, number>,
    previousTable: Table,
    tagId: number,
    tables: Table[],
    allocator: Allocator,
    componentViews: StructProxyClasses
): Table {
    const {
        hash, 
        insertIndex
    } = computeNewTableHashAdditionalTag(
        previousTable.componentIds,
        tagId,
        previousTable.components.length
    )
    const nextTableId = tableHashes.get(hash)
    // check if table has already been created
    if (nextTableId !== undefined) {
        previousTable.addEdges.set(tagId, nextTableId)        
        return tables[nextTableId]
    }
    const numberOfComponents = previousTable.componentIds.length + 1
    const newTableComponentIds = i32Malloc(
        allocator, numberOfComponents
    )
    newTableComponentIds.set(previousTable.componentIds)
    if (insertIndex === table_hashes.last_index) {
        newTableComponentIds[numberOfComponents - 1] = tagId
    } else {
        newTableComponentIds.copyWithin(
            insertIndex + 1,
            insertIndex,
            numberOfComponents
        )
        newTableComponentIds[insertIndex] = tagId
    }
    const newTableComponentPtrs = i32Malloc(
        allocator, numberOfComponents
    )
    const componentData = []
    for (let i = 0; i < previousTable.components.length; i++) {
        const componentId = previousTable.componentIds[i]
        const view = componentViews[componentId]
        const ptr = allocator.malloc(
            table_defaults.initial_capacity 
            * view.bytesPerElement
        )
        newTableComponentPtrs[i] = ptr
        const databuffer = new view.memoryConstructor(
            allocator.buf, ptr,
            table_defaults.initial_capacity
        )
        const component = new RawComponent(view, databuffer)
        componentData.push(component)
    }
    const newTableMeta = i32Malloc(allocator, table_encoding.meta_size)
    newTableMeta[table_encoding.capacity_index] = table_defaults.initial_capacity
    const newTableId = tables.length
    const createdTable = new Table(
        newTableId,
        hash,
        newTableComponentIds,
        componentData,
        newTableMeta,
        newTableComponentPtrs,
        i32Malloc(allocator, table_defaults.initial_capacity),
    )
    previousTable.addEdges.set(tagId, newTableId)
    tableHashes.set(hash, newTableId)
    tables.push(createdTable)
    return createdTable
}

export function shiftComponentDataAligned(
    source: Table,
    destination: Table,
    sourceRow: number,
    allocator: Allocator
): number {
    const targetLength = destination.length++
    destination.ensureSize(1, allocator)
    const targetComponentIndex = targetLength - 1
    const currentLength = source.length--
    const currentComponentLastIndex = currentLength - 1
    for (let c = 0; c < destination.components.length; c++) {
        const targetComponent = destination.components[c]
        const componentSegements = targetComponent.componentSegements
        const targetComponentOffset = componentSegements * targetComponentIndex
        const currentComponent = source.components[c]
        const currentComponentOffset = sourceRow * componentSegements
        const currentComponentLastOffset = currentComponentLastIndex * componentSegements
        for (let i = 0; i < componentSegements; i++) {
            const currentComponentIndex = currentComponentOffset + i
            const segment = currentComponent.databuffer[currentComponentIndex]
            targetComponent.databuffer[targetComponentOffset + i] = segment
            /* swap data found at the back of the component 
            buffer with the target entity's data to
            avoid any expensive shifting */
            currentComponent.databuffer[currentComponentIndex] = (
                currentComponent.databuffer[currentComponentLastOffset + i]
            )
        }
    }
    /* align entity ids according to shift */
    source.entities[sourceRow] = source.entities[currentComponentLastIndex]
    source.reclaimMemory(allocator)
    return targetLength
}

export function addTagComponent(
    entityId: number,
    tagId: number,
    records: EntityRecords,
    tables: Table[],
    tableHashes: Map<string, number>,
    allocator: Allocator,
    componentViews: StructProxyClasses
): MutatorStatusCode {
    const {table: tableId, row} = records.index(entityId)
    if (row === record_encoding.unintialized) {
        return mutation_status.entity_uninitialized
    }
    const table = tables[tableId]
    if (table.componentIndexes.has(tagId)) {
        return mutation_status.tag_exists
    }

    const graphTable = table.addEdges.get(tagId)
    const targetTable = graphTable !== undefined ?
        tables[graphTable] : findTableOrCreate(
            tableHashes, table, tagId,
            tables, allocator, componentViews,
        )
    // proceed to move entity data from current table to 
    // target table, (identical components, tags + new)
    shiftComponentDataAligned(table, targetTable, row, allocator)
    return mutation_status.successful_update
}

export class EntityMutator<
    Components extends ComponentsDeclaration
> {
    records: EntityRecords
    tables: Table[]
    databuffer: Float64Array
    tableHashes: Map<string, number>
    componentAllocator: Allocator
    componentClasses: StructProxyClasses

    constructor(
        records: EntityRecords,
        tables: Table[],
        databuffer: Float64Array,
        tableHashes: Map<string, number>,
        componentAllocator: Allocator,
        componentClasses: StructProxyClasses
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
            return mutation_status.entity_uninitialized
        }
        const table = this.tables[tablePtr]
        //if tag already exists on table, do nothing
        if (table.componentIndexes.has(tagId)) {
            return mutation_status.tag_exists
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
        return mutation_status.successful_update
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
        return mutation_status.tag_does_not_exist
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