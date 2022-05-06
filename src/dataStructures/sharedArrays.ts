const U8_BYTES = Uint8Array.BYTES_PER_ELEMENT 

/**
 * Returns a Uint8Array that is 
 * backed by a SharedArrayBuffer
 * 
 * @param {number} capacity number of elements
 * array can carry
 * @returns {Uint8Array}
 */
export function SharedUint8Array(capacity: number): Uint8Array {
    const bytes = new SharedArrayBuffer(U8_BYTES * capacity)
    return new Uint8Array(bytes)
}

const I32_BYTES = Int32Array.BYTES_PER_ELEMENT

/**
 * Returns a Int32Array that is 
 * backed by a SharedArrayBuffer
 * 
 * @param {number} capacity number of elements
 * array can carry
 * @returns {Int32Array}
 */
export function SharedInt32Array(capacity: number): Int32Array {
    const bytes = new SharedArrayBuffer(I32_BYTES * capacity)
    return new Int32Array(bytes)
}
