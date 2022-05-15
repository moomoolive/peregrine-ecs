"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oneHotBinary = exports.binaryOneHot = void 0;
const count_js_1 = require("./count.js");
/**
 * Converts binary `x` to one-hot format.
 *
 * @remarks
 * Reference: https://en.wikipedia.org/wiki/One-hot
 *
 * @param x -
 */
const binaryOneHot = (x) => (1 << x) >>> 0;
exports.binaryOneHot = binaryOneHot;
/**
 * Converts one-hot `x` into binary, i.e. the position of the hot bit.
 *
 * @remarks
 * Reference: https://en.wikipedia.org/wiki/One-hot
 *
 * @param x -
 */
const oneHotBinary = (x) => 31 - (0, count_js_1.clz32)(x);
exports.oneHotBinary = oneHotBinary;
