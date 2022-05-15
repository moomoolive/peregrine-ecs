"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TABLE_ALLOCATOR_NAME = "global_allocator";
function TableAllocatorAddress(rawAddress) {
    return `${TABLE_ALLOCATOR_NAME}[${rawAddress}]`;
}
/*
export function debugComponentPtrs(
    ptrs: Int32Array,
    tokens: ComponentTokens
): ComponentPtrsDebug {
    const componentSegmentsPtr = getComponentSegmentsPtr(ptrs)
    const fieldPointers: FieldPtrInfo<
        typeof TABLE_ALLOCATOR_NAME,
        number
    >[] = []
    const len = tokens.length - encoding.component_ptr_size
    for (let i = 0; i < len; i++) {
        const {name, ptrOffset, type} = tokens[i]
        const rawPtrAddress = ptrs[ptrOffset]
        fieldPointers.push({
            rawPtrAddress,
            prettyPtrAddress: globalAllocatorAddress(rawPtrAddress),
            name,
            type
        })
    }
    return {
        fieldPointers,
        componentSegmentsPtr: {
            rawPtrAddress: componentSegmentsPtr,
            prettyPtrAddress: globalAllocatorAddress(componentSegmentsPtr)
        }
    }
}
*/ 
