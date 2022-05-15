import type { FnN, FnN2 } from "@thi.ng/api";
/**
 * Returns number of 1 bits in `x`.
 *
 * @param x -
 */
export declare const popCount: FnN;
/**
 * Returns number of bit changes between `x` and `y`.
 *
 * {@link https://en.wikipedia.org/wiki/Hamming_distance}
 *
 * @param x -
 * @param y -
 */
export declare const hammingDist: FnN2;
/**
 * Math.clz32() polyfill (corrected).
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32$revision/1426816}
 *
 * @param x -
 */
export declare const clz32: FnN;
export declare const ctz32: FnN;
/**
 * Returns the number of bits required to encode `x`. Returns zero if
 * `x` <= 1.
 *
 * @param x -
 */
export declare const bitSize: FnN;
//# sourceMappingURL=count.d.ts.map