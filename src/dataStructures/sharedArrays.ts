import {bytes} from "../consts"

/**
 * Returns a Uint8Array that is 
 * backed by a SharedArrayBuffer
 * 
 * @param {number} capacity number of elements
 * array can carry
 * @returns {Uint8Array}
 */
export function createSharedUint8Array(capacity: number): Uint8Array {
    const buffer = new SharedArrayBuffer(bytes.u8 * capacity)
    return new Uint8Array(buffer)
}

/**
 * Returns a Int32Array that is 
 * backed by a SharedArrayBuffer
 * 
 * @param {number} capacity number of elements
 * array can carry
 * @returns {Int32Array}
 */
export function createSharedInt32Array(capacity: number): Int32Array {
    const buffer = new SharedArrayBuffer(bytes.i32 * capacity)
    return new Int32Array(buffer)
}

/**
 * Returns a Float64Array that is 
 * backed by a SharedArrayBuffer
 * 
 * @param {number} capacity number of elements
 * array can carry
 * @returns {Float64Array}
 */
 export function createSharedFloat64Array(capacity: number): Float64Array {
    const buffer = new SharedArrayBuffer(bytes.f64 * capacity)
    return new Float64Array(buffer)
}
