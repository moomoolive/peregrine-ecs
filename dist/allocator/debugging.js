"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugComponentPtrs = void 0;
const index_1 = require("../components/index");
const GLOBAL_ALLOCATOR_NAME = "global_allocator";
function globalAllocatorAddress(rawAddress) {
    return `${GLOBAL_ALLOCATOR_NAME}[${rawAddress}]`;
}
function debugComponentPtrs(ptrs, tokens) {
    const componentSegmentsPtr = (0, index_1.getComponentSegmentsPtr)(ptrs);
    const fieldPointers = [];
    const len = tokens.length - 1 /* component_ptr_size */;
    for (let i = 0; i < len; i++) {
        const { name, ptrOffset, type } = tokens[i];
        const rawPtrAddress = ptrs[ptrOffset];
        fieldPointers.push({
            rawPtrAddress,
            prettyPtrAddress: globalAllocatorAddress(rawPtrAddress),
            name,
            type
        });
    }
    return {
        fieldPointers,
        componentSegmentsPtr: {
            rawPtrAddress: componentSegmentsPtr,
            prettyPtrAddress: globalAllocatorAddress(componentSegmentsPtr)
        }
    };
}
exports.debugComponentPtrs = debugComponentPtrs;
