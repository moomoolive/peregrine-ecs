"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugComponentAllocator = exports.createComponentAllocator = void 0;
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
