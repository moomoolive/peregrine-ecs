import {
    RawComponent,
    StructProxyClass,
    ComponentDefinition
} from "../components/index"
import {
    computeAdditonalTagHash,
    table_hashes,
    computeRemoveTagHash,
    computeAdditonalComponentHash
} from "../table/hashing"
import {
    Table,
    table_encoding,
    table_defaults,
} from "../table/index"
import {
    Allocator,
    i32Malloc
} from "../allocator/index"

export type EntityMutationStatus = (
   -3 | -2 | -1 
   | 0 | 1 | 2 | 3 | 4
)

export const enum entity_mutation_status {
    not_component = -3,
    entity_immutable = -2,
    entity_uninitialized = -1,
    successful_added = 0,
    tag_exists = 1,
    component_exists = tag_exists,
    successfully_deleted = 2,
    tag_not_found = 3,
    successfully_removed = 4
}


export function findTableOrCreateAddTag(
    tableHashes: Map<string, number>,
    previousTable: Table,
    tagId: number,
    tables: Table[],
    allocator: Allocator
): Table {
    const {
        hash, 
        insertIndex
    } = computeAdditonalTagHash(
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
    const numberOfComponentIds = previousTable.componentIds.length + 1
    const newTableComponentIds = i32Malloc(
        allocator, numberOfComponentIds
    )
    newTableComponentIds.set(previousTable.componentIds)
    if (insertIndex === table_hashes.last_index) {
        newTableComponentIds[numberOfComponentIds - 1] = tagId
    } else {
        newTableComponentIds.copyWithin(
            insertIndex + 1,
            insertIndex,
            numberOfComponentIds
        )
        newTableComponentIds[insertIndex] = tagId
    }

    const newTableComponentPtrs = i32Malloc(
        allocator, previousTable.components.length
    )
    const componentData = []
    for (let i = 0; i < previousTable.components.length; i++) {
        const {
            id, bytesPerElement, componentSegements,
            memoryConstructor, structProxyFactory
        } = previousTable.components[i]
        const ptr = allocator.malloc(
            table_defaults.initial_capacity 
            * bytesPerElement
        )
        newTableComponentPtrs[i] = ptr
        const databuffer = new memoryConstructor(
            allocator.buf, ptr,
            table_defaults.initial_capacity
        )
        const targetComponent = new RawComponent(
            id, bytesPerElement, componentSegements,
            memoryConstructor, structProxyFactory,
            databuffer
        )
        componentData.push(targetComponent)
    }

    const newTableId = tables.length
    const newTableEntities = i32Malloc(
        allocator, table_defaults.initial_capacity
    )
    const createdTable = new Table(
        newTableId,
        hash,
        newTableComponentIds,
        componentData,
        i32Malloc(allocator, table_encoding.meta_size),
        newTableComponentPtrs,
        newTableEntities,
        table_defaults.initial_capacity
    )
    previousTable.addEdges.set(tagId, newTableId)
    createdTable.removeEdges.set(tagId, previousTable.id)
    tableHashes.set(hash, newTableId)
    tables.push(createdTable)
    return createdTable
}

export function findTableOrCreateRemoveTag(
    tableHashes: Map<string, number>,
    previousTable: Table,
    tagId: number,
    tables: Table[],
    allocator: Allocator,
): Table {
    const {
        hash, 
        removeIndex
    } = computeRemoveTagHash(
        previousTable.componentIds,
        tagId,
        previousTable.components.length
    )
    const nextTableId = tableHashes.get(hash)
    // check if table has already been created
    if (nextTableId !== undefined) {
        previousTable.removeEdges.set(tagId, nextTableId)        
        return tables[nextTableId]
    }
    const numberOfComponentIds = previousTable.componentIds.length - 1
    const newTableComponentIds = i32Malloc(
        allocator, numberOfComponentIds
    )

    const newTableComponentPtrs = i32Malloc(
        allocator, previousTable.components.length
    )
    const componentData = []
    for (let i = 0; i < previousTable.components.length; i++) {
        const {
            id, bytesPerElement, componentSegements,
            memoryConstructor, structProxyFactory
        } = previousTable.components[i]
        const ptr = allocator.malloc(
            table_defaults.initial_capacity 
            * bytesPerElement
        )
        newTableComponentPtrs[i] = ptr
        const databuffer = new memoryConstructor(
            allocator.buf, ptr,
            table_defaults.initial_capacity
        )
        const targetComponent = new RawComponent(
            id, bytesPerElement, componentSegements,
            memoryConstructor, structProxyFactory,
            databuffer
        )
        componentData.push(targetComponent)
    }

    // merged with top loop ?
    for (let i = 0; i < removeIndex; i++) {
        newTableComponentIds[i] = previousTable.componentIds[i]
    }
    for (let i = removeIndex; i < numberOfComponentIds; i++) {
        newTableComponentIds[i] = previousTable.componentIds[i + 1]
    }

    const newTableId = tables.length
    const newTableEntities = i32Malloc(
        allocator, table_defaults.initial_capacity
    )
    const createdTable = new Table(
        newTableId,
        hash,
        newTableComponentIds,
        componentData,
        i32Malloc(allocator, table_encoding.meta_size),
        newTableComponentPtrs,
        newTableEntities,
        table_defaults.initial_capacity
    )
    previousTable.removeEdges.set(tagId, newTableId)
    createdTable.addEdges.set(tagId, previousTable.id)
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
    /* move entity id to new table */
    destination.entities[targetLength] = source.entities[sourceRow]
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


export function findTableOrCreateAddComponent(
    tableHashes: Map<string, number>,
    previousTable: Table,
    componentId: number,
    tables: Table[],
    allocator: Allocator,
    proxyClass: StructProxyClass<ComponentDefinition>
): Table {
    const {
        hash, 
        insertIndex
    } = computeAdditonalComponentHash(
        previousTable.componentIds,
        componentId,
        previousTable.components.length
    )
    const nextTableId = tableHashes.get(hash)
    // check if table has already been created
    if (nextTableId !== undefined) {
        previousTable.addEdges.set(componentId, nextTableId)        
        return tables[nextTableId]
    }
    const numberOfComponentIds = previousTable.componentIds.length + 1
    const newTableComponentIds = i32Malloc(
        allocator, numberOfComponentIds
    )
    const componentsLength = previousTable.components.length
    let targetIndex: number
    newTableComponentIds.set(previousTable.componentIds)
    if (insertIndex === table_hashes.last_index) {
        newTableComponentIds[componentsLength] = componentId
        targetIndex = componentsLength
    } else {
        newTableComponentIds.copyWithin(
            insertIndex + 1,
            insertIndex,
            numberOfComponentIds
        )
        newTableComponentIds[insertIndex] = componentId
        targetIndex = insertIndex
    }

    const newTableComponentPtrs = i32Malloc(
        allocator, previousTable.components.length + 1
    )
    const componentData = []
    for (let i = 0; i < targetIndex; i++) {
        const {
            id, bytesPerElement, componentSegements,
            memoryConstructor, structProxyFactory
        } = previousTable.components[i]
        const ptr = allocator.malloc(
            table_defaults.initial_capacity 
            * bytesPerElement
        )
        newTableComponentPtrs[i] = ptr
        const databuffer = new memoryConstructor(
            allocator.buf, ptr,
            table_defaults.initial_capacity
        )
        const targetComponent = new RawComponent(
            id, bytesPerElement, componentSegements,
            memoryConstructor, structProxyFactory,
            databuffer
        )
        componentData.push(targetComponent)
    }

    const {
        id, bytesPerElement, componentSegements,
        memoryConstructor, View: structProxyFactory
    } = proxyClass
    const ptr = allocator.malloc(
        table_defaults.initial_capacity 
        * bytesPerElement
    )
    newTableComponentPtrs[targetIndex] = ptr
    const databuffer = new memoryConstructor(
        allocator.buf, ptr,
        table_defaults.initial_capacity
    )
    const targetComponent = new RawComponent(
        id, bytesPerElement, componentSegements,
        memoryConstructor, structProxyFactory,
        databuffer
    )
    componentData.push(targetComponent)

    for (let i = targetIndex; i < previousTable.components.length; i++) {
        const {
            id, bytesPerElement, componentSegements,
            memoryConstructor, structProxyFactory
        } = previousTable.components[i]
        const ptr = allocator.malloc(
            table_defaults.initial_capacity 
            * bytesPerElement
        )
        newTableComponentPtrs[i + 1] = ptr
        const databuffer = new memoryConstructor(
            allocator.buf, ptr,
            table_defaults.initial_capacity
        )
        const targetComponent = new RawComponent(
            id, bytesPerElement, componentSegements,
            memoryConstructor, structProxyFactory,
            databuffer
        )
        componentData.push(targetComponent)
    }

    const newTableId = tables.length
    const newTableEntities = i32Malloc(
        allocator, table_defaults.initial_capacity
    )
    const createdTable = new Table(
        newTableId,
        hash,
        newTableComponentIds,
        componentData,
        i32Malloc(allocator, table_encoding.meta_size),
        newTableComponentPtrs,
        newTableEntities,
        table_defaults.initial_capacity
    )
    previousTable.addEdges.set(componentId, newTableId)
    createdTable.removeEdges.set(componentId, previousTable.id)
    tableHashes.set(hash, newTableId)
    tables.push(createdTable)
    return createdTable
}

/* only works for adding right now */
export function shiftComponentDataUnaligned(
    source: Table,
    destination: Table,
    sourceRow: number,
    allocator: Allocator,
    unalignedIndex: number
): number {
    const targetLength = destination.length++
    destination.ensureSize(1, allocator)
    const targetComponentIndex = targetLength - 1
    const currentLength = source.length--
    /* move entity id to new table */
    destination.entities[targetLength] = source.entities[sourceRow]
    const currentComponentLastIndex = currentLength - 1
    /* shift bytes before unalignment */
    for (let c = 0; c < unalignedIndex; c++) {
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

    /* shift bytes after unalignment, skip unaligned component */
    for (let c = unalignedIndex; c < source.components.length; c++) {
        const targetComponent = destination.components[c + 1]
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