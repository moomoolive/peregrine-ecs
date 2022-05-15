"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maskH = exports.maskL = exports.defMask = void 0;
const constants_js_1 = require("./constants.js");
/**
 * Creates bit mask by enabling bit `a` to bit `b-1`, both in range
 * 0-32. `b` MUST be >= `a`.
 *
 * @example
 * ```ts
 * defMask(1,31).toString(16) // 7ffffffe
 * defMask(3,8).toString(16)  // f8
 * ```
 *
 * @param a - first bit
 * @param b - last bit
 */
const defMask = (a, b) => (~constants_js_1.MASKS[a] & constants_js_1.MASKS[b]) >>> 0;
exports.defMask = defMask;
/**
 * Returns unsigned version of `x` with only lowest `n` bits.
 *
 * @param n - number of LSB bits
 * @param x - value
 */
const maskL = (n, x) => (x & constants_js_1.MASKS[n]) >>> 0;
exports.maskL = maskL;
/**
 * Returns unsigned version of `x` with only highest `n` bits.
 *
 * @param n - number of MSB bits
 * @param x - value
 */
const maskH = (n, x) => (x & ~constants_js_1.MASKS[n]) >>> 0;
exports.maskH = maskH;
