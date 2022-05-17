"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shiftComponentDataAligned = exports.findTableOrCreate = void 0;
const index_1 = require("../components/index");
const index_2 = require("../table/index");
const index_3 = require("../allocator/index");
function findTableOrCreate(tableHashes, previousTable, tagId, tables, allocator, componentViews) {
    const { hash, insertIndex } = (0, index_2.computeNewTableHashAdditionalTag)(previousTable.componentIds, tagId, previousTable.components.length);
    const nextTableId = tableHashes.get(hash);
    // check if table has already been created
    if (nextTableId !== undefined) {
        previousTable.addEdges.set(tagId, nextTableId);
        return tables[nextTableId];
    }
    const numberOfComponents = previousTable.componentIds.length + 1;
    const newTableComponentIds = (0, index_3.i32Malloc)(allocator, numberOfComponents);
    newTableComponentIds.set(previousTable.componentIds);
    if (insertIndex === -1 /* last_index */) {
        newTableComponentIds[numberOfComponents - 1] = tagId;
    }
    else {
        newTableComponentIds.copyWithin(insertIndex + 1, insertIndex, numberOfComponents);
        newTableComponentIds[insertIndex] = tagId;
    }
    const newTableComponentPtrs = (0, index_3.i32Malloc)(allocator, numberOfComponents);
    const componentData = [];
    for (let i = 0; i < previousTable.components.length; i++) {
        const componentId = previousTable.componentIds[i];
        const view = componentViews[componentId];
        const ptr = allocator.malloc(1 /* initial_capacity */
            * view.bytesPerElement);
        newTableComponentPtrs[i] = ptr;
        const databuffer = new view.memoryConstructor(allocator.buf, ptr, 1 /* initial_capacity */);
        const component = new index_1.RawComponent(view, databuffer);
        componentData.push(component);
    }
    const newTableId = tables.length;
    const createdTable = new index_2.Table(newTableId, hash, newTableComponentIds, componentData, (0, index_3.i32Malloc)(allocator, 5 /* meta_size */), newTableComponentPtrs, (0, index_3.i32Malloc)(allocator, 1 /* initial_capacity */));
    previousTable.addEdges.set(tagId, newTableId);
    tableHashes.set(hash, newTableId);
    tables.push(createdTable);
    return createdTable;
}
exports.findTableOrCreate = findTableOrCreate;
function shiftComponentDataAligned(source, destination, sourceRow, allocator) {
    const targetLength = destination.length++;
    destination.ensureSize(1, allocator);
    const targetComponentIndex = targetLength - 1;
    const currentLength = source.length--;
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
