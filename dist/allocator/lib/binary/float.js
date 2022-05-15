"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.u32f32 = exports.u24f32 = exports.u16f32 = exports.u8f32 = exports.f32u32 = exports.f32u24 = exports.f32u16 = exports.f32u8 = exports.floatToSortableInt = exports.uintBitsToFloat64 = exports.intBitsToFloat64 = exports.floatToUintBits64 = exports.floatToIntBits64 = exports.uintBitsToFloat = exports.intBitsToFloat = exports.floatToUintBits = exports.floatToIntBits = exports.IS_LE = void 0;
const F64 = new Float64Array(1);
const F32 = new Float32Array(F64.buffer);
const I32 = new Int32Array(F64.buffer);
const U32 = new Uint32Array(F64.buffer);
/**
 * This value is true iff the environment is Little Endian.
 */
exports.IS_LE = ((F64[0] = 2), U32[1] === 0x40000000);
const floatToIntBits = (x) => ((F32[0] = x), I32[0]);
exports.floatToIntBits = floatToIntBits;
const floatToUintBits = (x) => ((F32[0] = x), U32[0]);
exports.floatToUintBits = floatToUintBits;
const intBitsToFloat = (x) => ((I32[0] = x), F32[0]);
exports.intBitsToFloat = intBitsToFloat;
const uintBitsToFloat = (x) => ((U32[0] = x), F32[0]);
exports.uintBitsToFloat = uintBitsToFloat;
/**
 * Returns i32 representation of f64 as [hi, lo] tuple (takes
 * environment's Little Endianess into account).
 *
 * @param x -
 */
const floatToIntBits64 = (x) => ((F64[0] = x), exports.IS_LE ? [I32[1], I32[0]] : [I32[0], I32[1]]);
exports.floatToIntBits64 = floatToIntBits64;
/**
 * Returns u32 representation of f64 as [hi, lo] tuple (takes
 * environment's Little Endianess into account).
 *
 * @param x -
 */
const floatToUintBits64 = (x) => ((F64[0] = x), exports.IS_LE ? [U32[1], U32[0]] : [U32[0], U32[1]]);
exports.floatToUintBits64 = floatToUintBits64;
/**
 * Reverse op of {@link floatToIntBits64}.
 *
 * @param hi -
 * @param lo -
 */
const intBitsToFloat64 = (hi, lo) => {
    exports.IS_LE ? ((I32[1] = hi), (I32[0] = lo)) : ((I32[0] = hi), (I32[1] = lo));
    return F64[0];
};
exports.intBitsToFloat64 = intBitsToFloat64;
/**
 * Reverse op of {@link floatToUintBits64}.
 *
 * @param hi -
 * @param lo -
 */
const uintBitsToFloat64 = (hi, lo) => {
    exports.IS_LE ? ((U32[1] = hi), (U32[0] = lo)) : ((U32[0] = hi), (U32[1] = lo));
    return F64[0];
};
exports.uintBitsToFloat64 = uintBitsToFloat64;
/**
 * Converts given float (f32) into a sortable integer representation,
 * using raw bitwise conversion via {@link floatToIntBits}.
 *
 * {@link https://github.com/tzaeschke/phtree/blob/develop/PhTreeRevisited.pdf}
 * (page 3)
 *
 * @param x - value to convert
 */
const floatToSortableInt = (x) => {
    if (x === -0)
        x = 0;
    const i = (0, exports.floatToIntBits)(x);
    return x < 0 ? ~i | (1 << 31) : i;
};
exports.floatToSortableInt = floatToSortableInt;
const clamp11 = (x) => (x < -1 ? -1 : x > 1 ? 1 : x);
/**
 * Converts normalized float ([-1..1] range) to u8.
 *
 * @param x -
 */
const f32u8 = (x) => (clamp11(x) * 0x7f) & 0xff;
exports.f32u8 = f32u8;
/**
 * Converts normalized float ([-1..1] range) to u16.
 *
 * @param x -
 */
const f32u16 = (x) => (clamp11(x) * 0x7fff) & 0xffff;
exports.f32u16 = f32u16;
/**
 * Converts normalized float ([-1..1] range) to u24.
 *
 * @param x -
 */
const f32u24 = (x) => (clamp11(x) * 0x7fffff) & 0xffffff;
exports.f32u24 = f32u24;
/**
 * Converts normalized float ([-1..1] range) to u32.
 *
 * @param x -
 */
const f32u32 = (x) => (clamp11(x) * 0x7fffffff) >>> 0;
exports.f32u32 = f32u32;
/**
 * Reverse op of {@link f32u8}.
 *
 * @param x -
 */
const u8f32 = (x) => ((x &= 0xff), (x | ((x >> 7) * 0xffffff00)) / 0x7f);
exports.u8f32 = u8f32;
/**
 * Reverse op of {@link f32u16}.
 *
 * @param x -
 */
const u16f32 = (x) => ((x &= 0xffff), (x | ((x >> 15) * 0xffff0000)) / 0x7fff);
exports.u16f32 = u16f32;
/**
 * Reverse op of {@link f32u24}.
 *
 * @param x -
 */
const u24f32 = (x) => ((x &= 0xffffff), (x | ((x >> 23) * 0xff000000)) / 0x7fffff);
exports.u24f32 = u24f32;
/**
 * Reverse op of {@link f32u32}.
 *
 * @param x -
 */
const u32f32 = (x) => (x | 0) / 0x7fffffff;
exports.u32f32 = u32f32;
