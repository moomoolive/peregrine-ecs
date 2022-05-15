"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeGray32 = exports.encodeGray32 = void 0;
/**
 * Converts 32bit unsigned int to Gray code (reflected binary). Gray
 * codes of successive values always have a Hamming distance of 1 (i.e.
 * only 1 bit changes at a time).
 *
 * {@link https://en.wikipedia.org/wiki/Gray_code}
 *
 * @param x - u32
 */
const encodeGray32 = (x) => (x ^ (x >>> 1)) >>> 0;
exports.encodeGray32 = encodeGray32;
/**
 * Converts 32bit Gray code to binary / unsigned int.
 *
 * {@link https://en.wikipedia.org/wiki/Gray_code}
 */
const decodeGray32 = (x) => {
    x = x ^ (x >>> 16);
    x = x ^ (x >>> 8);
    x = x ^ (x >>> 4);
    x = x ^ (x >>> 2);
    x = x ^ (x >>> 1);
    return x >>> 0;
};
exports.decodeGray32 = decodeGray32;
