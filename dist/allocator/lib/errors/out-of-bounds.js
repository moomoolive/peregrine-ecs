"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureIndex2 = exports.ensureIndex = exports.outOfBounds = exports.OutOfBoundsError = void 0;
const deferror_js_1 = require("./deferror.js");
exports.OutOfBoundsError = (0, deferror_js_1.defError)(() => "index out of bounds");
const outOfBounds = (index) => {
    throw new exports.OutOfBoundsError(index);
};
exports.outOfBounds = outOfBounds;
/**
 * Throws an {@link OutOfBoundsError} if `index` outside the `[min..max)` range.
 *
 * @param index -
 * @param min -
 * @param max -
 */
const ensureIndex = (index, min, max) => (index < min || index >= max) && (0, exports.outOfBounds)(index);
exports.ensureIndex = ensureIndex;
/**
 * Throws an {@link OutOfBoundsError} if either `x` or `y` is outside their
 * respective `[0..max)` range.
 *
 * @param x -
 * @param y -
 * @param maxX -
 * @param maxY -
 */
const ensureIndex2 = (x, y, maxX, maxY) => (x < 0 || x >= maxX || y < 0 || y >= maxY) && (0, exports.outOfBounds)([x, y]);
exports.ensureIndex2 = ensureIndex2;
