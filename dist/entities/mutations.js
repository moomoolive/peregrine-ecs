"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shiftComponentDataAligned = exports.findTableOrCreateRemoveHash = exports.findTableOrCreate = void 0;
const index_1 = require("../components/index");
const index_2 = require("../table/index");
const index_3 = require("../allocator/index");
function findTableOrCreate(tableHashes, previousTable, tagId, tables, allocator) {
    const { hash, insertIndex } = (0, index_2.computeAdditonalTagHash)(previousTable.componentIds, tagId, previousTable.components.length);
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
exports.findTableOrCreate = findTableOrCreate;
function findTableOrCreateRemoveHash(tableHashes, previousTable, tagId, tables, allocator) {
    const { hash, removeIndex } = (0, index_2.computeRemoveTagHash)(previousTable.componentIds, tagId, previousTable.components.length);
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
exports.findTableOrCreateRemoveHash = findTableOrCreateRemoveHash;
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
