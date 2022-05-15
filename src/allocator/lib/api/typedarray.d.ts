export declare type ArrayLikeIterable<T> = ArrayLike<T> & Iterable<T>;
export declare type NumericArray = number[] | TypedArray;
export declare type TypedArray = Float32Array | Float64Array | Int8Array | Int16Array | Int32Array | Uint8Array | Uint8ClampedArray | Uint16Array | Uint32Array;
export declare type FloatArray = Float32Array | Float64Array;
export declare type IntArray = Int8Array | Int16Array | Int32Array;
export declare type UIntArray = Uint8Array | Uint8ClampedArray | Uint16Array | Uint32Array;
export declare type FloatArrayConstructor = Float32ArrayConstructor | Float64ArrayConstructor;
export declare type IntArrayConstructor = Int8ArrayConstructor | Int16ArrayConstructor | Int32ArrayConstructor;
export declare type UIntArrayConstructor = Uint8ArrayConstructor | Uint8ClampedArrayConstructor | Uint16ArrayConstructor | Uint32ArrayConstructor;
export declare type TypedArrayConstructor = FloatArrayConstructor | IntArrayConstructor | UIntArrayConstructor;
/**
 * Type IDs for typed array backed buffers and generally describing binary data
 * values.
 *
 * {@link GLType} {@link GL2TYPE} {@link TYPE2GL}
 */
export declare type Type = "u8" | "u8c" | "i8" | "u16" | "i16" | "u32" | "i32" | "f32" | "f64";
export declare type UintType = "u8" | "u8c" | "u16" | "u32";
export declare type IntType = "i8" | "i16" | "i32";
export declare type FloatType = "f32" | "f64";
/**
 * WebGL numeric type constants. Use {@link GL2TYPE} to convert, if needed.
 *
 * {@link Type}
 * {@link GL2TYPE}
 * {@link TYPE2GL}
 */
export declare enum GLType {
    I8 = 5120,
    U8 = 5121,
    I16 = 5122,
    U16 = 5123,
    I32 = 5124,
    U32 = 5125,
    F32 = 5126
}
/**
 * Conversion from {@link GLType} to {@link Type} enums.
 */
export declare const GL2TYPE: Record<GLType, Type>;
/**
 * Potentially lossy conversion from {@link Type} to {@link GLType} enums.
 *
 * Not all enums are mappable:
 *
 * - `F64` maps to `undefined`, since unsupported by WebGL
 * - `U8C` maps to "u8"
 */
export declare const TYPE2GL: Record<Type, GLType | undefined>;
/**
 * Size information (in bytes) for {@link Type}. Also see {@link sizeOf}.
 */
export declare const SIZEOF: {
    u8: number;
    u8c: number;
    i8: number;
    u16: number;
    i16: number;
    u32: number;
    i32: number;
    f32: number;
    f64: number;
};
export declare const FLOAT_ARRAY_CTORS: Record<FloatType, FloatArrayConstructor>;
export declare const INT_ARRAY_CTORS: Record<IntType, IntArrayConstructor>;
export declare const UINT_ARRAY_CTORS: Record<UintType, UIntArrayConstructor>;
export declare const TYPEDARRAY_CTORS: Record<Type, TypedArrayConstructor>;
export interface TypedArrayTypeMap extends Record<Type | GLType, TypedArray> {
    u8: Uint8Array;
    u8c: Uint8ClampedArray;
    i8: Int8Array;
    u16: Uint16Array;
    i16: Int16Array;
    u32: Uint32Array;
    i32: Int32Array;
    f32: Float32Array;
    f64: Float64Array;
    [GLType.U8]: Uint8Array;
    [GLType.I8]: Int8Array;
    [GLType.U16]: Uint16Array;
    [GLType.I16]: Int16Array;
    [GLType.U32]: Uint32Array;
    [GLType.I32]: Int32Array;
    [GLType.F32]: Float32Array;
}
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
export declare const asNativeType: (type: GLType | Type) => Type;
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
export declare const asGLType: (type: GLType | Type) => GLType;
/**
 * Coerces given numeric args to integer values.
 */
export declare const asInt: (...args: number[]) => number[];
/**
 * Returns byte size for given {@link Type} ID or {@link GLType} enum.
 *
 * @param type -
 */
export declare const sizeOf: (type: GLType | Type) => number;
/**
 * Constructs new typed array of given {@link Type}/{@link GLType}. Supports all
 * arities of standard typed array ctors.
 *
 * @param type - array type enum
 */
export declare function typedArray<T extends Type | GLType>(type: T, length: number): TypedArrayTypeMap[T];
export declare function typedArray<T extends Type | GLType>(type: T, src: ArrayLike<number> | ArrayBufferLike): TypedArrayTypeMap[T];
export declare function typedArray<T extends Type | GLType>(type: T, buf: ArrayBufferLike, byteOffset: number, length?: number): TypedArrayTypeMap[T];
/**
 * Takes an {@link NumericArray} and returns its corresponding {@link Type} ID.
 * Standard JS arrays will default to {@link "f64"}.
 *
 * @param x -
 */
export declare const typedArrayType: (x: NumericArray) => Type;
/**
 * Returns the smallest possible *unsigned* int type enum for given `x`.
 * E.g. if `x <= 256`, the function returns `"u8"`.
 *
 * @param x - value to classify
 */
export declare const uintTypeForSize: (x: number) => UintType;
/**
 * Returns the smallest possible *signed* int type enum for given `x`.
 * E.g. if `x >= -128 && x < 128`, the function returns `"i8"`.
 *
 * @param x - value to classify
 */
export declare const intTypeForSize: (x: number) => IntType;
/**
 * Returns suitable {@link UintType} for given bit size (`[0,32]` range)
 *
 * @param x -
 */
export declare const uintTypeForBits: (x: number) => UintType;
/**
 * Returns suitable {@link IntType} for given bit size (`[0,32]` range)
 *
 * @param x -
 */
export declare const intTypeForBits: (x: number) => IntType;
//# sourceMappingURL=typedarray.d.ts.map