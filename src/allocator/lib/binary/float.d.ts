import type { FnN, FnN2 } from "@thi.ng/api";
/**
 * This value is true iff the environment is Little Endian.
 */
export declare const IS_LE: boolean;
export declare const floatToIntBits: FnN;
export declare const floatToUintBits: FnN;
export declare const intBitsToFloat: FnN;
export declare const uintBitsToFloat: FnN;
/**
 * Returns i32 representation of f64 as [hi, lo] tuple (takes
 * environment's Little Endianess into account).
 *
 * @param x -
 */
export declare const floatToIntBits64: (x: number) => [number, number];
/**
 * Returns u32 representation of f64 as [hi, lo] tuple (takes
 * environment's Little Endianess into account).
 *
 * @param x -
 */
export declare const floatToUintBits64: (x: number) => [number, number];
/**
 * Reverse op of {@link floatToIntBits64}.
 *
 * @param hi -
 * @param lo -
 */
export declare const intBitsToFloat64: FnN2;
/**
 * Reverse op of {@link floatToUintBits64}.
 *
 * @param hi -
 * @param lo -
 */
export declare const uintBitsToFloat64: FnN2;
/**
 * Converts given float (f32) into a sortable integer representation,
 * using raw bitwise conversion via {@link floatToIntBits}.
 *
 * {@link https://github.com/tzaeschke/phtree/blob/develop/PhTreeRevisited.pdf}
 * (page 3)
 *
 * @param x - value to convert
 */
export declare const floatToSortableInt: FnN;
/**
 * Converts normalized float ([-1..1] range) to u8.
 *
 * @param x -
 */
export declare const f32u8: FnN;
/**
 * Converts normalized float ([-1..1] range) to u16.
 *
 * @param x -
 */
export declare const f32u16: FnN;
/**
 * Converts normalized float ([-1..1] range) to u24.
 *
 * @param x -
 */
export declare const f32u24: FnN;
/**
 * Converts normalized float ([-1..1] range) to u32.
 *
 * @param x -
 */
export declare const f32u32: FnN;
/**
 * Reverse op of {@link f32u8}.
 *
 * @param x -
 */
export declare const u8f32: FnN;
/**
 * Reverse op of {@link f32u16}.
 *
 * @param x -
 */
export declare const u16f32: FnN;
/**
 * Reverse op of {@link f32u24}.
 *
 * @param x -
 */
export declare const u24f32: FnN;
/**
 * Reverse op of {@link f32u32}.
 *
 * @param x -
 */
export declare const u32f32: FnN;
//# sourceMappingURL=float.d.ts.map