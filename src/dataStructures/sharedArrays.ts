import {Bytes} from "../consts"

/**
 * Returns a Uint8Array that is 
 * backed by a SharedArrayBuffer
 * 
 * @param {number} capacity number of elements
 * array can carry
 * @returns {Uint8Array}
 */
export function SharedUint8Array(capacity: number): Uint8Array {
    const bytes = new SharedArrayBuffer(Bytes.u8 * capacity)
    return new Uint8Array(bytes)
}

/**
 * Returns a Int32Array that is 
 * backed by a SharedArrayBuffer
 * 
 * @param {number} capacity number of elements
 * array can carry
 * @returns {Int32Array}
 */
export function SharedInt32Array(capacity: number): Int32Array {
    const bytes = new SharedArrayBuffer(Bytes.i32 * capacity)
    return new Int32Array(bytes)
}

/**
 * Returns a Float64Array that is 
 * backed by a SharedArrayBuffer
 * 
 * @param {number} capacity number of elements
 * array can carry
 * @returns {Float64Array}
 */
 export function SharedFloat64Array(capacity: number): Float64Array {
    const bytes = new SharedArrayBuffer(Bytes.f64 * capacity)
    return new Float64Array(bytes)
}
