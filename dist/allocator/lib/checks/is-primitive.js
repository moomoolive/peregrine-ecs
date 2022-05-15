"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPrimitive = void 0;
/**
 * Returns true if `x` is a string, number or boolean.
 *
 * @param x -
 */
const isPrimitive = (x) => {
    const t = typeof x;
    return t === "string" || t === "number" || t === "boolean";
};
exports.isPrimitive = isPrimitive;
