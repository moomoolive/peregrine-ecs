"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedInt32Array = exports.SharedUint8Array = void 0;
const U8_BYTES = Uint8Array.BYTES_PER_ELEMENT;
/**
 * Returns a Uint8Array that is
 * backed by a SharedArrayBuffer
 *
 * @param {number} capacity number of elements
 * array can carry
 * @returns {Uint8Array}
 */
function SharedUint8Array(capacity) {
    const bytes = new SharedArrayBuffer(U8_BYTES * capacity);
    return new Uint8Array(bytes);
}
exports.SharedUint8Array = SharedUint8Array;
const I32_BYTES = Int32Array.BYTES_PER_ELEMENT;
/**
 * Returns a Int32Array that is
 * backed by a SharedArrayBuffer
 *
 * @param {number} capacity number of elements
 * array can carry
 * @returns {Int32Array}
 */
function SharedInt32Array(capacity) {
    const bytes = new SharedArrayBuffer(I32_BYTES * capacity);
    return new Int32Array(bytes);
}
exports.SharedInt32Array = SharedInt32Array;
