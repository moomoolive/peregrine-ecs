"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPrintableASCII = exports.isASCII = void 0;
/**
 * Returns true iff all chars are in ASCII range [0x00 .. 0x7f]
 *
 * @param x -
 */
const isASCII = (x) => /^[\x00-\x7f]+$/.test(x);
exports.isASCII = isASCII;
/**
 * Returns true iff all chars are in printable ASCII range [0x20 .. 0x7e]
 *
 * @param x -
 */
const isPrintableASCII = (x) => /^[\x20-\x7e]+$/.test(x);
exports.isPrintableASCII = isPrintableASCII;
