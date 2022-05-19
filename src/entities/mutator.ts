import {
    StructProxyClasses,
    RawComponent,
} from "../components/index"
import {
    Table,
    computeNewTableHashAdditionalTag,
    table_hashes,
    table_encoding,
    table_defaults,
} from "../table/index"
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
    const newTableId = tables.length
    const createdTable = new Table(
        newTableId,
        hash,
        newTableComponentIds,
        componentData,
        i32Malloc(allocator, table_encoding.meta_size),
        newTableComponentPtrs,
        i32Malloc(allocator, table_defaults.initial_capacity),
        table_defaults.initial_capacity
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