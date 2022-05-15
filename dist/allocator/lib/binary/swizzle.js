"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swapLane13 = exports.swapLane02 = exports.flipBytes = exports.flip16 = exports.flip8 = exports.mux = exports.swizzle4 = exports.swizzle8 = exports.setLane2 = exports.setLane4 = exports.setLane8 = exports.setLane16 = exports.lane2 = exports.lane4 = exports.lane8 = exports.lane16 = void 0;
/**
 * Extracts 16-bit lane from given 32bit uint and returns as unsigned
 * half word [0x0000 .. 0xffff].
 *
 * - Lane #0: bits 16-31
 * - Lane #1: bits 0-15
 *
 * @param x -
 * @param lane - lane ID enum
 */
const lane16 = (x, lane) => (x >>> ((1 - lane) << 4)) & 0xffff;
exports.lane16 = lane16;
/**
 * Extracts 8-bit lane from given 32bit uint and returns as unsigned
 * byte [0x00 .. 0xff].
 *
 * - Lane #0: bits 24-31
 * - Lane #1: bits 16-23
 * - Lane #2: bits 8-15
 * - Lane #3: bits 0-7
 *
 * @param x -
 * @param lane - lane ID enum
 */
const lane8 = (x, lane) => (x >>> ((3 - lane) << 3)) & 0xff;
exports.lane8 = lane8;
/**
 * Extracts 4-bit lane from given 32bit uint and returns as unsigned
 * nibble [0x00 .. 0x0f].
 *
 * - Lane #0: bits 28-31
 * - Lane #1: bits 24-27
 * - Lane #2: bits 20-23
 * - Lane #3: bits 16-19
 * - Lane #4: bits 12-15
 * - Lane #5: bits 8-11
 * - Lane #6: bits 4-7
 * - Lane #7: bits 0-3
 *
 * @param x -
 * @param lane - lane ID enum
 */
const lane4 = (x, lane) => (x >>> ((7 - lane) << 2)) & 0xf;
exports.lane4 = lane4;
const lane2 = (x, lane) => (x >>> ((15 - lane) << 1)) & 0x3;
exports.lane2 = lane2;
const setLane16 = (x, y, lane) => lane ? (0, exports.mux)(x, y, 0xffff) : (0, exports.mux)(x, y << 16, 0xffff0000);
exports.setLane16 = setLane16;
/**
 * Sets 8-bit `lane` with value`y` in `x`.
 *
 * {@link lane8}
 *
 * @param x -
 * @param y -
 * @param lane - lane ID enum
 */
const setLane8 = (x, y, lane) => {
    const l = (3 - lane) << 3;
    return ((~(0xff << l) & x) | ((y & 0xff) << l)) >>> 0;
};
exports.setLane8 = setLane8;
/**
 * Sets 4-bit `lane` with value `y` in `x`.
 *
 * {@link lane4}
 *
 * @param x -
 * @param y -
 * @param lane - lane ID enum
 */
const setLane4 = (x, y, lane) => {
    const l = (7 - lane) << 2;
    return ((~(0xf << l) & x) | ((y & 0xf) << l)) >>> 0;
};
exports.setLane4 = setLane4;
/**
 * Sets 2-bit `lane` with value `y` in `x`.
 *
 * {@link lane2}
 *
 * @param x -
 * @param y -
 * @param lane - lane ID enum
 */
const setLane2 = (x, y, lane) => {
    const l = (15 - lane) << 1;
    return ((~(0x3 << l) & x) | ((y & 0x3) << l)) >>> 0;
};
exports.setLane2 = setLane2;
/**
 * Re-orders byte lanes in given order (MSB).
 *
 * @example
 * ```ts
 * swizzle(0x12345678, 3, 2, 1, 0) // 0x78563412
 * swizzle(0x12345678, 1, 0, 3, 2) // 0x34127856
 * swizzle(0x12345678, 2, 2, 0, 0) // 0x56561212
 * ```
 *
 * @param x - value
 * @param a - lane ID enum
 * @param b - lane ID enum
 * @param c - lane ID enum
 * @param d - lane ID enum
 */
const swizzle8 = (x, a, b, c, d) => (((0, exports.lane8)(x, a) << 24) |
    ((0, exports.lane8)(x, b) << 16) |
    ((0, exports.lane8)(x, c) << 8) |
    (0, exports.lane8)(x, d)) >>>
    0;
exports.swizzle8 = swizzle8;
/**
 *
 * @param x - value
 * @param a - lane ID enum
 * @param b - lane ID enum
 * @param c - lane ID enum
 * @param d - lane ID enum
 * @param e - lane ID enum
 * @param f - lane ID enum
 * @param g - lane ID enum
 * @param h - lane ID enum
 */
const swizzle4 = (x, a, b, c, d, e, f, g, h) => (((0, exports.lane4)(x, a) << 28) |
    ((0, exports.lane4)(x, b) << 24) |
    ((0, exports.lane4)(x, c) << 20) |
    ((0, exports.lane4)(x, d) << 16) |
    ((0, exports.lane4)(x, e) << 12) |
    ((0, exports.lane4)(x, f) << 8) |
    ((0, exports.lane4)(x, g) << 4) |
    (0, exports.lane4)(x, h)) >>>
    0;
exports.swizzle4 = swizzle4;
/**
 * Merges bits of `a` and `b`, selecting bits from `b` where `mask` bits
 * are set.
 *
 * @example
 * ```ts
 * mux(0x12345678, 0xaaaa5555, 0xffff0000)
 * // 0xaaaa5678
 *
 * mux(0x12345678, 0xaaaa5555, 0x0000ffff)
 * // 0x12345555
 * ```
 *
 * @param a -
 * @param b -
 * @param mask -
 */
const mux = (a, b, mask) => (~mask & a) | (mask & b);
exports.mux = mux;
/**
 * Same as `swizzle8(x, 3, 2, 1, 0)`, but faster.
 *
 * @param x -
 */
const flip8 = (x) => ((x >>> 24) | ((x >> 8) & 0xff00) | ((x & 0xff00) << 8) | (x << 24)) >>> 0;
exports.flip8 = flip8;
/**
 * Swaps the highest & lowest 16 bits in `x`.
 *
 * @example
 * ```ts
 * flip16(0x12345678)
 * // 0x56781234
 * ```
 *
 * @param x -
 */
const flip16 = (x) => (0, exports.mux)(x << 16, x >>> 16, 0xffff);
exports.flip16 = flip16;
/**
 * @deprecated renamed to {@link flip8}
 */
exports.flipBytes = exports.flip8;
/**
 * Swaps bytes lanes 0 & 2 (i.e. bits 24-31 with bits 8-15)
 *
 * @param x -
 */
const swapLane02 = (x) => ((x & 0xff00) << 16) | ((x >>> 16) & 0xff00) | (x & 0x00ff00ff);
exports.swapLane02 = swapLane02;
/**
 * Swaps bytes lanes 1 & 3 (i.e. bits 16-23 with bits 0-7)
 *
 * @param x -
 */
const swapLane13 = (x) => ((x & 0xff) << 16) | ((x >> 16) & 0xff) | (x & 0xff00ff00);
exports.swapLane13 = swapLane13;
