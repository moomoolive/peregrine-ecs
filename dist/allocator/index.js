"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.i32Malloc = exports.debugComponentAllocator = exports.createComponentAllocator = void 0;
const malloc_1 = require("@thi.ng/malloc");
function createComponentAllocator(byteSize, workerThread) {
    return new malloc_1.MemPool({
        buf: new SharedArrayBuffer(byteSize),
        skipInitialization: workerThread
    });
}
exports.createComponentAllocator = createComponentAllocator;
function debugComponentAllocator(allocator) {
    return allocator.stats();
}
exports.debugComponentAllocator = debugComponentAllocator;
function i32Malloc(allocator, size) {
    const ptr = allocator.malloc(size * 4 /* i32 */);
    return new Int32Array(allocator.buf, ptr, size);
}
exports.i32Malloc = i32Malloc;
