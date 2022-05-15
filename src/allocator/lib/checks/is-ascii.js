/**
 * Returns true iff all chars are in ASCII range [0x00 .. 0x7f]
 *
 * @param x -
 */
export const isASCII = (x) => /^[\x00-\x7f]+$/.test(x);
/**
 * Returns true iff all chars are in printable ASCII range [0x20 .. 0x7e]
 *
 * @param x -
 */
export const isPrintableASCII = (x) => /^[\x20-\x7e]+$/.test(x);
