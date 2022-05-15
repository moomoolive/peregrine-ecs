"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bytesF64 = exports.bytesF32 = exports.bytes64 = exports.bytes32 = exports.bytes24 = exports.bytes16 = void 0;
const float_js_1 = require("./float.js");
const bytes16 = (x, le = false) => {
    const b0 = x & 0xff;
    const b1 = (x >> 8) & 0xff;
    return le ? [b0, b1] : [b1, b0];
};
exports.bytes16 = bytes16;
const bytes24 = (x, le = false) => {
    const b0 = x & 0xff;
    const b1 = (x >> 8) & 0xff;
    const b2 = (x >> 16) & 0xff;
    return le ? [b0, b1, b2] : [b2, b1, b0];
};
exports.bytes24 = bytes24;
const bytes32 = (x, le = false) => {
    const b0 = x & 0xff;
    const b1 = (x >> 8) & 0xff;
    const b2 = (x >> 16) & 0xff;
    const b3 = (x >> 24) & 0xff;
    return le ? [b0, b1, b2, b3] : [b3, b2, b1, b0];
};
exports.bytes32 = bytes32;
const bytes64 = (hi, lo, le = false) => {
    return le
        ? (0, exports.bytes32)(lo, le).concat((0, exports.bytes32)(hi, le))
        : (0, exports.bytes32)(hi, le).concat((0, exports.bytes32)(lo, le));
};
exports.bytes64 = bytes64;
const bytesF32 = (x, le = false) => (0, exports.bytes32)((0, float_js_1.floatToUintBits)(x), le);
exports.bytesF32 = bytesF32;
const bytesF64 = (x, le = false) => 
//@ts-ignore
(0, exports.bytes64)(...(0, float_js_1.floatToUintBits64)(x), le);
exports.bytesF64 = bytesF64;
