"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deref = exports.isDeref = void 0;
/**
 * Returns true iff `x` implements {@link IDeref}.
 *
 * @param x -
 */
const isDeref = (x) => x != null && typeof x["deref"] === "function";
exports.isDeref = isDeref;
/**
 * If `x` implements {@link IDeref}, returns its wrapped value, else
 * returns `x` itself.
 *
 * @param x -
 */
const deref = (x) => ((0, exports.isDeref)(x) ? x.deref() : x);
exports.deref = deref;
