"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intTypeForBits = exports.uintTypeForBits = exports.intTypeForSize = exports.uintTypeForSize = exports.typedArrayType = exports.typedArray = exports.sizeOf = exports.asInt = exports.asGLType = exports.asNativeType = exports.TYPEDARRAY_CTORS = exports.UINT_ARRAY_CTORS = exports.INT_ARRAY_CTORS = exports.FLOAT_ARRAY_CTORS = exports.SIZEOF = exports.TYPE2GL = exports.GL2TYPE = exports.GLType = void 0;
(function (GLType) {
    GLType[GLType["I8"] = 5120] = "I8";
    GLType[GLType["U8"] = 5121] = "U8";
    GLType[GLType["I16"] = 5122] = "I16";
    GLType[GLType["U16"] = 5123] = "U16";
    GLType[GLType["I32"] = 5124] = "I32";
    GLType[GLType["U32"] = 5125] = "U32";
    GLType[GLType["F32"] = 5126] = "F32";
})(exports.GLType || (exports.GLType = {}));
/**
 * Conversion from {@link GLType} to {@link Type} enums.
 */
exports.GL2TYPE = {
    [exports.GLType.I8]: "i8",
    [exports.GLType.U8]: "u8",
    [exports.GLType.I16]: "i16",
    [exports.GLType.U16]: "u16",
    [exports.GLType.I32]: "i32",
    [exports.GLType.U32]: "u32",
    [exports.GLType.F32]: "f32",
};
/**
 * Potentially lossy conversion from {@link Type} to {@link GLType} enums.
 *
 * Not all enums are mappable:
 *
 * - `F64` maps to `undefined`, since unsupported by WebGL
 * - `U8C` maps to "u8"
 */
exports.TYPE2GL = {
    i8: exports.GLType.I8,
    u8: exports.GLType.U8,
    u8c: exports.GLType.U8,
    i16: exports.GLType.I16,
    u16: exports.GLType.U16,
    i32: exports.GLType.I32,
    u32: exports.GLType.U32,
    f32: exports.GLType.F32,
    f64: undefined,
};
/**
 * Size information (in bytes) for {@link Type}. Also see {@link sizeOf}.
 */
exports.SIZEOF = {
    u8: 1,
    u8c: 1,
    i8: 1,
    u16: 2,
    i16: 2,
    u32: 4,
    i32: 4,
    f32: 4,
    f64: 8,
};
exports.FLOAT_ARRAY_CTORS = {
    f32: Float32Array,
    f64: Float64Array,
};
exports.INT_ARRAY_CTORS = {
    i8: Int8Array,
    i16: Int16Array,
    i32: Int32Array,
};
exports.UINT_ARRAY_CTORS = {
    u8: Uint8Array,
    u8c: Uint8ClampedArray,
    u16: Uint16Array,
    u32: Uint32Array,
};
exports.TYPEDARRAY_CTORS = Object.assign(Object.assign(Object.assign({}, exports.FLOAT_ARRAY_CTORS), exports.INT_ARRAY_CTORS), exports.UINT_ARRAY_CTORS);
/**
 * Returns canonical {@link Type} value of `type` by first
 * attempting to resolve it as {@link GLType} enum.
 *
 * @example
 * ```ts
 * asNativeType(GLType.F32) => "f32"
 * asNativeType("f32") => "f32"
 * ```
 *
 * @param type -
 */
const asNativeType = (type) => {
    const t = exports.GL2TYPE[type];
    return t !== undefined ? t : type;
};
exports.asNativeType = asNativeType;
/**
 * Returns suitable {@link GLType} enum of `type`.
 *
 * @example
 * ```ts
 * asGLType("f32") => GLType.F32
 * asGLType(GLType.F32) => GLType.F32
 * ```
 *
 * @param type -
 */
const asGLType = (type) => {
    const t = exports.TYPE2GL[type];
    return t !== undefined ? t : type;
};
exports.asGLType = asGLType;
/**
 * Coerces given numeric args to integer values.
 */
const asInt = (...args) => args.map((x) => x | 0);
exports.asInt = asInt;
/**
 * Returns byte size for given {@link Type} ID or {@link GLType} enum.
 *
 * @param type -
 */
const sizeOf = (type) => exports.SIZEOF[(0, exports.asNativeType)(type)];
exports.sizeOf = sizeOf;
function typedArray(type, ...xs) {
    return new exports.TYPEDARRAY_CTORS[(0, exports.asNativeType)(type)](...xs);
}
exports.typedArray = typedArray;
/**
 * Takes an {@link NumericArray} and returns its corresponding {@link Type} ID.
 * Standard JS arrays will default to {@link "f64"}.
 *
 * @param x -
 */
const typedArrayType = (x) => {
    if (Array.isArray(x))
        return "f64";
    for (let id in exports.TYPEDARRAY_CTORS) {
        if (x instanceof exports.TYPEDARRAY_CTORS[id])
            return id;
    }
    return "f64";
};
exports.typedArrayType = typedArrayType;
/**
 * Returns the smallest possible *unsigned* int type enum for given `x`.
 * E.g. if `x <= 256`, the function returns `"u8"`.
 *
 * @param x - value to classify
 */
const uintTypeForSize = (x) => x <= 0x100 ? "u8" : x <= 0x10000 ? "u16" : "u32";
exports.uintTypeForSize = uintTypeForSize;
/**
 * Returns the smallest possible *signed* int type enum for given `x`.
 * E.g. if `x >= -128 && x < 128`, the function returns `"i8"`.
 *
 * @param x - value to classify
 */
const intTypeForSize = (x) => x >= -0x80 && x < 0x80 ? "i8" : x >= -0x8000 && x < 0x8000 ? "i16" : "i32";
exports.intTypeForSize = intTypeForSize;
/**
 * Returns suitable {@link UintType} for given bit size (`[0,32]` range)
 *
 * @param x -
 */
const uintTypeForBits = (x) => x > 16 ? "u32" : x > 8 ? "u16" : "u8";
exports.uintTypeForBits = uintTypeForBits;
/**
 * Returns suitable {@link IntType} for given bit size (`[0,32]` range)
 *
 * @param x -
 */
const intTypeForBits = (x) => x > 16 ? "i32" : x > 8 ? "i16" : "i8";
exports.intTypeForBits = intTypeForBits;
