"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shiftRL = exports.rotateRight = exports.rotateLeft = void 0;
/**
 * Rotates `x` `n` bits to the left.
 *
 * @param x - value
 * @param n - rotation step
 */
const rotateLeft = (x, n) => ((x << n) | (x >>> (32 - n))) >>> 0;
exports.rotateLeft = rotateLeft;
/**
 * Rotates `x` `n` bits to the right.
 *
 * @param x - value
 * @param n - rotation step
 */
const rotateRight = (x, n) => ((x >>> n) | (x << (32 - n))) >>> 0;
exports.rotateRight = rotateRight;
/**
 * Shifts `x` by `n` bits left or right. If `n` >= 0, the value will be `>>>`
 * shifted to right, if `n` < 0 the value will be shifted left.
 *
 * @param x -
 * @param n -
 */
const shiftRL = (x, n) => (n < 0 ? x << -n : x >>> n);
exports.shiftRL = shiftRL;
