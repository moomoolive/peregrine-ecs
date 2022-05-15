"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interleave4_16_32 = exports.interleave4_12_24 = exports.same8 = exports.same4 = exports.splat16_32 = exports.splat8_32 = exports.splat8_24 = exports.splat4_32 = exports.splat4_24 = void 0;
/**
 * Repeats lowest nibble of `x` as 24 bit uint.
 *
 * @param x -
 */
const splat4_24 = (x) => (x & 0xf) * 0x111111;
exports.splat4_24 = splat4_24;
/**
 * Repeats lowest nibble of `x` as 32 bit uint.
 *
 * @param x -
 */
const splat4_32 = (x) => ((x & 0xf) * 0x11111111) >>> 0;
exports.splat4_32 = splat4_32;
/**
 * Repeats lowest byte of `x` as 24 bit uint.
 *
 * @param x -
 */
const splat8_24 = (x) => (x & 0xff) * 0x010101;
exports.splat8_24 = splat8_24;
/**
 * Repeats lowest byte of `x` as 32 bit uint.
 *
 * @param x -
 */
const splat8_32 = (x) => ((x & 0xff) * 0x01010101) >>> 0;
exports.splat8_32 = splat8_32;
/**
 * Repeats lowest 16bit of `x` as 32 bit uint.
 *
 * @param x -
 */
const splat16_32 = (x) => ((x &= 0xffff), ((x << 16) | x) >>> 0);
exports.splat16_32 = splat16_32;
/**
 * Returns true if bits 0-3 are same as bits 4-7.
 *
 * @param x -
 */
const same4 = (x) => ((x >> 4) & 0xf) === (x & 0xf);
exports.same4 = same4;
/**
 * Returns true if bits 0-7 are same as bits 8-15.
 *
 * @param x -
 */
const same8 = (x) => ((x >> 8) & 0xff) === (x & 0xff);
exports.same8 = same8;
/**
 * Expands 3x4bit value like `0xabc` to 24bits: `0xaabbcc`
 *
 * @param x -
 */
const interleave4_12_24 = (x) => ((x & 0xf00) * 0x1100) | ((x & 0xf0) * 0x110) | ((x & 0xf) * 0x11);
exports.interleave4_12_24 = interleave4_12_24;
/**
 * Expands 4x4bit value like `0xabcd` to 32bits: `0xaabbccdd`
 *
 * @param x -
 */
const interleave4_16_32 = (x) => (((x & 0xf000) * 0x11000) |
    ((x & 0xf00) * 0x1100) |
    ((x & 0xf0) * 0x110) |
    ((x & 0xf) * 0x11)) >>>
    0;
exports.interleave4_16_32 = interleave4_16_32;
