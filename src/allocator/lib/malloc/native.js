import { typedArray, } from "@thi.ng/api/typedarray";
/**
 * Stub/polyfill implementation of {@link IMemPoolArray}, merely delegating to
 * JS typed array ctors with no further management of returned arrays.
 */
export class NativePool {
    mallocAs(type, num) {
        return typedArray(type, num);
    }
    callocAs(type, num, fill = 0) {
        return typedArray(type, num).fill(fill);
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
