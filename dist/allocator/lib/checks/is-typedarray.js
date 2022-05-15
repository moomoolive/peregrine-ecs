"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTypedArray = void 0;
const isTypedArray = (x) => x &&
    (x instanceof Float32Array ||
        x instanceof Float64Array ||
        x instanceof Uint32Array ||
        x instanceof Int32Array ||
        x instanceof Uint8Array ||
        x instanceof Int8Array ||
        x instanceof Uint16Array ||
        x instanceof Int16Array ||
        x instanceof Uint8ClampedArray);
exports.isTypedArray = isTypedArray;
