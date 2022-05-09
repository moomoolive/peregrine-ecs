"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComponentAllocator = void 0;
const index_1 = require("@thi.ng/malloc/index");
function createComponentAllocator(byteSize, workerThread) {
    return new index_1.MemPool({
        buf: new SharedArrayBuffer(byteSize),
        skipInitialization: workerThread
    });
}
exports.createComponentAllocator = createComponentAllocator;
