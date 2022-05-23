"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTableOrCreateRemoveComponent = exports.shiftComponentDataUnaligned = exports.findTableOrCreateAddComponent = exports.shiftComponentDataAligned = exports.findTableOrCreateRemoveTag = exports.findTableOrCreateAddTag = void 0;
const index_1 = require("../components/index");
const hashing_1 = require("../table/hashing");
const index_2 = require("../table/index");
const index_3 = require("../allocator/index");
function findTableOrCreateAddTag(tableHashes, previousTable, tagId, tables, allocator) {
    const { hash, insertIndex } = (0, hashing_1.computeAdditonalTagHash)(previousTable.componentIds, tagId, previousTable.components.length);
    const nextTableId = tableHashes.get(hash);
    // check if table has already been created
    if (nextTableId !== undefined) {
        previousTable.addEdges.set(tagId, nextTableId);
        return tables[nextTableId];
    }
    const numberOfComponentIds = previousTable.componentIds.length + 1;
    const newTableComponentIds = (0, index_3.i32Malloc)(allocator, numberOfComponentIds);
    newTableComponentIds.set(previousTable.componentIds);
    if (insertIndex === -1 /* last_index */) {
        newTableComponentIds[numberOfComponentIds - 1] = tagId;
    }
    else {
        newTableComponentIds.copyWithin(insertIndex + 1, insertIndex, numberOfComponentIds);
        newTableComponentIds[insertIndex] = tagId;
    }
    const newTableComponentPtrs = (0, index_3.i32Malloc)(allocator, previousTable.components.length);
    const componentData = [];
    for (let i = 0; i < previousTable.components.length; i++) {
        const { id, bytesPerElement, componentSegements, memoryConstructor, structProxyFactory } = previousTable.components[i];
        const ptr = allocator.malloc(1 /* initial_capacity */
            * bytesPerElement);
        newTableComponentPtrs[i] = ptr;
        const databuffer = new memoryConstructor(allocator.buf, ptr, 1 /* initial_capacity */);
        const targetComponent = new index_1.RawComponent(id, bytesPerElement, componentSegements, memoryConstructor, structProxyFactory, databuffer);
        componentData.push(targetComponent);
    }
    const newTableId = tables.length;
    const newTableEntities = (0, index_3.i32Malloc)(allocator, 1 /* initial_capacity */);
    const createdTable = new index_2.Table(newTableId, hash, newTableComponentIds, componentData, (0, index_3.i32Malloc)(allocator, 6 /* meta_size */), newTableComponentPtrs, newTableEntities, 1 /* initial_capacity */);
    previousTable.addEdges.set(tagId, newTableId);
    createdTable.removeEdges.set(tagId, previousTable.id);
    tableHashes.set(hash, newTableId);
    tables.push(createdTable);
    return createdTable;
}
exports.findTableOrCreateAddTag = findTableOrCreateAddTag;
function findTableOrCreateRemoveTag(tableHashes, previousTable, tagId, tables, allocator) {
    const { hash, removeIndex } = (0, hashing_1.computeRemoveTagHash)(previousTable.componentIds, tagId, previousTable.components.length);
    const nextTableId = tableHashes.get(hash);
    // check if table has already been created
    if (nextTableId !== undefined) {
        previousTable.removeEdges.set(tagId, nextTableId);
        return tables[nextTableId];
    }
    const numberOfComponentIds = previousTable.componentIds.length - 1;
    const newTableComponentIds = (0, index_3.i32Malloc)(allocator, numberOfComponentIds);
    const newTableComponentPtrs = (0, index_3.i32Malloc)(allocator, previousTable.components.length);
    const componentData = [];
    for (let i = 0; i < previousTable.components.length; i++) {
        const { id, bytesPerElement, componentSegements, memoryConstructor, structProxyFactory } = previousTable.components[i];
        const ptr = allocator.malloc(1 /* initial_capacity */
            * bytesPerElement);
        newTableComponentPtrs[i] = ptr;
        const databuffer = new memoryConstructor(allocator.buf, ptr, 1 /* initial_capacity */);
        const targetComponent = new index_1.RawComponent(id, bytesPerElement, componentSegements, memoryConstructor, structProxyFactory, databuffer);
        componentData.push(targetComponent);
    }
    // merged with top loop ?
    for (let i = 0; i < removeIndex; i++) {
        newTableComponentIds[i] = previousTable.componentIds[i];
    }
    for (let i = removeIndex; i < numberOfComponentIds; i++) {
        newTableComponentIds[i] = previousTable.componentIds[i + 1];
    }
    const newTableId = tables.length;
    const newTableEntities = (0, index_3.i32Malloc)(allocator, 1 /* initial_capacity */);
    const createdTable = new index_2.Table(newTableId, hash, newTableComponentIds, componentData, (0, index_3.i32Malloc)(allocator, 6 /* meta_size */), newTableComponentPtrs, newTableEntities, 1 /* initial_capacity */);
    previousTable.removeEdges.set(tagId, newTableId);
    createdTable.addEdges.set(tagId, previousTable.id);
    tableHashes.set(hash, newTableId);
    tables.push(createdTable);
    return createdTable;
}
exports.findTableOrCreateRemoveTag = findTableOrCreateRemoveTag;
function shiftComponentDataAligned(source, destination, sourceRow, allocator) {
    const targetLength = destination.length++;
    destination.ensureSize(1, allocator);
    const targetComponentIndex = targetLength - 1;
    const currentLength = source.length--;
    /* move entity id to new table */
    destination.entities[targetLength] = source.entities[sourceRow];
    const currentComponentLastIndex = currentLength - 1;
    for (let c = 0; c < destination.components.length; c++) {
        const targetComponent = destination.components[c];
        const componentSegements = targetComponent.componentSegements;
        const targetComponentOffset = componentSegements * targetComponentIndex;
        const currentComponent = source.components[c];
        const currentComponentOffset = sourceRow * componentSegements;
        const currentComponentLastOffset = currentComponentLastIndex * componentSegements;
        for (let i = 0; i < componentSegements; i++) {
            const currentComponentIndex = currentComponentOffset + i;
            const segment = currentComponent.databuffer[currentComponentIndex];
            targetComponent.databuffer[targetComponentOffset + i] = segment;
            /* swap data found at the back of the component
            buffer with the target entity's data to
            avoid any expensive shifting */
            currentComponent.databuffer[currentComponentIndex] = (currentComponent.databuffer[currentComponentLastOffset + i]);
        }
    }
    /* align entity ids according to shift */
    source.entities[sourceRow] = source.entities[currentComponentLastIndex];
    source.reclaimMemory(allocator);
    return targetLength;
}
exports.shiftComponentDataAligned = shiftComponentDataAligned;
function findTableOrCreateAddComponent(tableHashes, previousTable, componentId, tables, allocator, proxyClass) {
    const { hash, insertIndex } = (0, hashing_1.computeAdditonalComponentHash)(previousTable.componentIds, componentId, previousTable.components.length);
    const nextTableId = tableHashes.get(hash);
    // check if table has already been created
    if (nextTableId !== undefined) {
        previousTable.addEdges.set(componentId, nextTableId);
        return tables[nextTableId];
    }
    const numberOfComponentIds = previousTable.componentIds.length + 1;
    const newTableComponentIds = (0, index_3.i32Malloc)(allocator, numberOfComponentIds);
    const componentsLength = previousTable.components.length;
    let targetIndex;
    newTableComponentIds.set(previousTable.componentIds);
    if (insertIndex === -1 /* last_index */) {
        newTableComponentIds[componentsLength] = componentId;
        targetIndex = componentsLength;
    }
    else {
        newTableComponentIds.copyWithin(insertIndex + 1, insertIndex, numberOfComponentIds);
        newTableComponentIds[insertIndex] = componentId;
        targetIndex = insertIndex;
    }
    const newTableComponentPtrs = (0, index_3.i32Malloc)(allocator, previousTable.components.length + 1);
    const componentData = [];
    for (let i = 0; i < targetIndex; i++) {
        const { id, bytesPerElement, componentSegements, memoryConstructor, structProxyFactory } = previousTable.components[i];
        const ptr = allocator.malloc(1 /* initial_capacity */
            * bytesPerElement);
        newTableComponentPtrs[i] = ptr;
        const databuffer = new memoryConstructor(allocator.buf, ptr, (1 /* initial_capacity */
            * componentSegements));
        const targetComponent = new index_1.RawComponent(id, bytesPerElement, componentSegements, memoryConstructor, structProxyFactory, databuffer);
        componentData.push(targetComponent);
    }
    const { id, bytesPerElement, componentSegements, memoryConstructor, View: structProxyFactory } = proxyClass;
    const ptr = allocator.malloc(1 /* initial_capacity */
        * bytesPerElement);
    newTableComponentPtrs[targetIndex] = ptr;
    const databuffer = new memoryConstructor(allocator.buf, ptr, (1 /* initial_capacity */
        * componentSegements));
    const targetComponent = new index_1.RawComponent(id, bytesPerElement, componentSegements, memoryConstructor, structProxyFactory, databuffer);
    componentData.push(targetComponent);
    for (let i = targetIndex; i < previousTable.components.length; i++) {
        const { id, bytesPerElement, componentSegements, memoryConstructor, structProxyFactory } = previousTable.components[i];
        const ptr = allocator.malloc(1 /* initial_capacity */
            * bytesPerElement);
        newTableComponentPtrs[i + 1] = ptr;
        const databuffer = new memoryConstructor(allocator.buf, ptr, (1 /* initial_capacity */
            * componentSegements));
        const targetComponent = new index_1.RawComponent(id, bytesPerElement, componentSegements, memoryConstructor, structProxyFactory, databuffer);
        componentData.push(targetComponent);
    }
    const newTableId = tables.length;
    const newTableEntities = (0, index_3.i32Malloc)(allocator, 1 /* initial_capacity */);
    const createdTable = new index_2.Table(newTableId, hash, newTableComponentIds, componentData, (0, index_3.i32Malloc)(allocator, 6 /* meta_size */), newTableComponentPtrs, newTableEntities, 1 /* initial_capacity */);
    previousTable.addEdges.set(componentId, newTableId);
    createdTable.removeEdges.set(componentId, previousTable.id);
    tableHashes.set(hash, newTableId);
    tables.push(createdTable);
    return createdTable;
}
exports.findTableOrCreateAddComponent = findTableOrCreateAddComponent;
function shiftComponentDataUnaligned(source, destination, sourceRow, allocator, unalignedIndex, add) {
    const targetLength = destination.length++;
    destination.ensureSize(1, allocator);
    const targetComponentIndex = targetLength;
    const currentLength = source.length--;
    /* move entity id to new table */
    destination.entities[targetLength] = source.entities[sourceRow];
    const currentComponentLastIndex = currentLength - 1;
    /* shift bytes before unalignment */
    for (let c = 0; c < unalignedIndex; c++) {
        const targetComponent = destination.components[c];
        const componentSegements = targetComponent.componentSegements;
        const targetComponentOffset = componentSegements * targetComponentIndex;
        const currentComponent = source.components[c];
        const currentComponentOffset = sourceRow * componentSegements;
        const currentComponentLastOffset = currentComponentLastIndex * componentSegements;
        for (let i = 0; i < componentSegements; i++) {
            const currentComponentIndex = currentComponentOffset + i;
            const segment = currentComponent.databuffer[currentComponentIndex];
            targetComponent.databuffer[targetComponentOffset + i] = segment;
            /* swap data found at the back of the component
            buffer with the target entity's data to
            avoid any expensive shifting */
            currentComponent.databuffer[currentComponentIndex] = (currentComponent.databuffer[currentComponentLastOffset + i]);
        }
    }
    let len;
    let targetIncrement;
    let currentIncrement;
    if (add) {
        len = source.components.length;
        targetIncrement = 1;
        currentIncrement = 0;
    }
    else {
        len = destination.components.length;
        targetIncrement = 0;
        currentIncrement = 1;
    }
    for (let c = unalignedIndex; c < len; c++) {
        const targetComponent = destination.components[c + targetIncrement];
        const componentSegements = targetComponent.componentSegements;
        const targetComponentOffset = componentSegements * targetComponentIndex;
        const currentComponent = source.components[c + currentIncrement];
        const currentComponentOffset = sourceRow * componentSegements;
        const currentComponentLastOffset = currentComponentLastIndex * componentSegements;
        for (let i = 0; i < componentSegements; i++) {
            const currentComponentIndex = currentComponentOffset + i;
            const segment = currentComponent.databuffer[currentComponentIndex];
            targetComponent.databuffer[targetComponentOffset + i] = segment;
            /* swap data found at the back of the component
            buffer with the target entity's data to
            avoid any expensive shifting */
            currentComponent.databuffer[currentComponentIndex] = (currentComponent.databuffer[currentComponentLastOffset + i]);
        }
    }
    /* align entity ids according to shift */
    source.entities[sourceRow] = source.entities[currentComponentLastIndex];
    source.reclaimMemory(allocator);
    return targetLength;
}
exports.shiftComponentDataUnaligned = shiftComponentDataUnaligned;
function findTableOrCreateRemoveComponent(tableHashes, previousTable, componentId, tables, allocator) {
    const { hash, removeIndex } = (0, hashing_1.computeRemoveComponentHash)(previousTable.componentIds, componentId, previousTable.components.length);
    const nextTableId = tableHashes.get(hash);
    // check if table has already been created
    if (nextTableId !== undefined) {
        previousTable.removeEdges.set(componentId, nextTableId);
        return tables[nextTableId];
    }
    const newTableComponentIds = (0, index_3.i32Malloc)(allocator, previousTable.componentIds.length - 1);
    const newTableComponentPtrs = (0, index_3.i32Malloc)(allocator, previousTable.components.length - 1);
    const componentData = [];
    for (let i = 0; i < removeIndex; i++) {
        const { id, bytesPerElement, componentSegements, memoryConstructor, structProxyFactory } = previousTable.components[i];
        const ptr = allocator.malloc(1 /* initial_capacity */
            * bytesPerElement);
        newTableComponentPtrs[i] = ptr;
        const databuffer = new memoryConstructor(allocator.buf, ptr, 1 /* initial_capacity */);
        const targetComponent = new index_1.RawComponent(id, bytesPerElement, componentSegements, memoryConstructor, structProxyFactory, databuffer);
        componentData.push(targetComponent);
    }
    const previousComponentCount = previousTable.components.length;
    for (let i = removeIndex + 1; i < previousComponentCount; i++) {
        const { id, bytesPerElement, componentSegements, memoryConstructor, structProxyFactory } = previousTable.components[i];
        const ptr = allocator.malloc(1 /* initial_capacity */
            * bytesPerElement);
        newTableComponentPtrs[i - 1] = ptr;
        const databuffer = new memoryConstructor(allocator.buf, ptr, 1 /* initial_capacity */);
        const targetComponent = new index_1.RawComponent(id, bytesPerElement, componentSegements, memoryConstructor, structProxyFactory, databuffer);
        componentData.push(targetComponent);
    }
    // merged with top loop ?
    for (let i = 0; i < removeIndex; i++) {
        newTableComponentIds[i] = previousTable.componentIds[i];
    }
    for (let i = removeIndex + 1; i < previousComponentCount; i++) {
        newTableComponentIds[i - 1] = previousTable.componentIds[i];
    }
    const newTableId = tables.length;
    const newTableEntities = (0, index_3.i32Malloc)(allocator, 1 /* initial_capacity */);
    const createdTable = new index_2.Table(newTableId, hash, newTableComponentIds, componentData, (0, index_3.i32Malloc)(allocator, 6 /* meta_size */), newTableComponentPtrs, newTableEntities, 1 /* initial_capacity */);
    previousTable.removeEdges.set(componentId, newTableId);
    createdTable.addEdges.set(componentId, previousTable.id);
    tableHashes.set(hash, newTableId);
    tables.push(createdTable);
    return createdTable;
}
exports.findTableOrCreateRemoveComponent = findTableOrCreateRemoveComponent;
