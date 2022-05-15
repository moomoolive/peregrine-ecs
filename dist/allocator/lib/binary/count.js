"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bitSize = exports.ctz32 = exports.clz32 = exports.hammingDist = exports.popCount = void 0;
/**
 * Returns number of 1 bits in `x`.
 *
 * @param x -
 */
const popCount = (x) => ((x = x - ((x >>> 1) & 0x55555555)),
    (x = (x & 0x33333333) + ((x >>> 2) & 0x33333333)),
    (((x + (x >>> 4)) & 0xf0f0f0f) * 0x1010101) >>> 24);
exports.popCount = popCount;
/**
 * Returns number of bit changes between `x` and `y`.
 *
 * {@link https://en.wikipedia.org/wiki/Hamming_distance}
 *
 * @param x -
 * @param y -
 */
const hammingDist = (x, y) => (0, exports.popCount)(x ^ y);
exports.hammingDist = hammingDist;
/**
 * Math.clz32() polyfill (corrected).
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32$revision/1426816}
 *
 * @param x -
 */
const clz32 = (x) => x !== 0 ? 31 - ((Math.log(x >>> 0) / Math.LN2) | 0) : 32;
exports.clz32 = clz32;
const ctz32 = (x) => {
    let c = 32;
    x &= -x;
    x && c--;
    x & 0x0000ffff && (c -= 16);
    x & 0x00ff00ff && (c -= 8);
    x & 0x0f0f0f0f && (c -= 4);
    x & 0x33333333 && (c -= 2);
    x & 0x55555555 && (c -= 1);
    return c;
};
exports.ctz32 = ctz32;
/**
 * Returns the number of bits required to encode `x`. Returns zero if
 * `x` <= 1.
 *
 * @param x -
 */
const bitSize = (x) => (x > 1 ? Math.ceil(Math.log2(x)) : 0);
exports.bitSize = bitSize;
