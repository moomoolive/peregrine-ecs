"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NativePool = void 0;
const typedarray_1 = require("@thi.ng/api/typedarray");
/**
 * Stub/polyfill implementation of {@link IMemPoolArray}, merely delegating to
 * JS typed array ctors with no further management of returned arrays.
 */
class NativePool {
    mallocAs(type, num) {
        return (0, typedarray_1.typedArray)(type, num);
    }
    callocAs(type, num, fill = 0) {
        return (0, typedarray_1.typedArray)(type, num).fill(fill);
    }
    reallocArray(src, num) {
        if (num === src.length)
            return src;
        const dest = new src.constructor(num);
        dest.set(src.subarray(0, Math.min(src.length, num)));
        return dest;
    }
    free(_) {
        return true;
    }
    freeAll() { }
    release() {
        return true;
    }
}
exports.NativePool = NativePool;
