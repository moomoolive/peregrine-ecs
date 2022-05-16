"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.i32Malloc = exports.debugComponentAllocator = exports.createComponentAllocator = void 0;
/*
this import is a slightly modified fork of the
awesome "@thi.ng/malloc" npm package (v6.1.6).
Check out the docs inside the library: /lib/malloc/readme.md
*/
const index_1 = require("./lib/malloc/index");
function createComponentAllocator(byteSize, workerThread) {
    return new index_1.MemPool({
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
