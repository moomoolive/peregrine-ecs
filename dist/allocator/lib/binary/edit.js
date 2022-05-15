"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bitClearWindow = exports.bitSetWindow = exports.bitSet = exports.bitFlip = exports.bitClear = void 0;
const mask_js_1 = require("./mask.js");
/**
 * Clears bit in given uint `x`.
 *
 * @param x - value
 * @param bit - bit number (0..31)
 */
const bitClear = (x, bit) => (x & ~(1 << bit)) >>> 0;
exports.bitClear = bitClear;
/**
 * Toggles bit in given uint `x`.
 *
 * @param x - value
 * @param bit - bit ID
 */
const bitFlip = (x, bit) => (x ^ (1 << bit)) >>> 0;
exports.bitFlip = bitFlip;
/**
 * Sets bit in given uint `x`.
 *
 * @param x - value
 * @param bit - bit number (0..31)
 */
const bitSet = (x, bit) => (x | (1 << bit)) >>> 0;
exports.bitSet = bitSet;
const bitSetWindow = (x, y, from, to) => {
    const m = (0, mask_js_1.defMask)(from, to);
    return (x & ~m) | ((y << (1 << from)) & m);
};
exports.bitSetWindow = bitSetWindow;
const bitClearWindow = (x, from, to) => x & ~(0, mask_js_1.defMask)(from, to);
exports.bitClearWindow = bitClearWindow;
