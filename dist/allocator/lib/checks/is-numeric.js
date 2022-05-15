"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumericFloat = exports.isNumericInt = void 0;
/**
 * Returns true if given string contains only digits, and optionally, a sign
 * prefix.
 *
 * @param x -
 */
const isNumericInt = (x) => /^[-+]?\d+$/.test(x);
exports.isNumericInt = isNumericInt;
/**
 * Returns true if given string only contains an integer or floating point
 * number, optionally in scientific notiation (e.g. `-123.45e-6`).
 *
 * @param x -
 */
const isNumericFloat = (x) => /^[-+]?\d*\.?\d+(e[-+]?\d+)?$/i.test(x);
exports.isNumericFloat = isNumericFloat;
