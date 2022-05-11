"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSharedFloat64Array = exports.createSharedInt32Array = exports.createSharedUint8Array = void 0;
/**
 * Returns a Uint8Array that is
 * backed by a SharedArrayBuffer
 *
 * @param {number} capacity number of elements
 * array can carry
 * @returns {Uint8Array}
 */
function createSharedUint8Array(capacity) {
    const buffer = new SharedArrayBuffer(1 /* u8 */ * capacity);
    return new Uint8Array(buffer);
}
exports.createSharedUint8Array = createSharedUint8Array;
/**
 * Returns a Int32Array that is
 * backed by a SharedArrayBuffer
 *
 * @param {number} capacity number of elements
 * array can carry
 * @returns {Int32Array}
 */
function createSharedInt32Array(capacity) {
    const buffer = new SharedArrayBuffer(4 /* i32 */ * capacity);
    return new Int32Array(buffer);
}
exports.createSharedInt32Array = createSharedInt32Array;
/**
 * Returns a Float64Array that is
 * backed by a SharedArrayBuffer
 *
 * @param {number} capacity number of elements
 * array can carry
 * @returns {Float64Array}
 */
function createSharedFloat64Array(capacity) {
    const buffer = new SharedArrayBuffer(8 /* f64 */ * capacity);
    return new Float64Array(buffer);
}
exports.createSharedFloat64Array = createSharedFloat64Array;
