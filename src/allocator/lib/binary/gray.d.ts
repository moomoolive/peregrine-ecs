import type { FnN } from "@thi.ng/api";
/**
 * Converts 32bit unsigned int to Gray code (reflected binary). Gray
 * codes of successive values always have a Hamming distance of 1 (i.e.
 * only 1 bit changes at a time).
 *
 * {@link https://en.wikipedia.org/wiki/Gray_code}
 *
 * @param x - u32
 */
export declare const encodeGray32: FnN;
/**
 * Converts 32bit Gray code to binary / unsigned int.
 *
 * {@link https://en.wikipedia.org/wiki/Gray_code}
 */
export declare const decodeGray32: FnN;
//# sourceMappingURL=gray.d.ts.map