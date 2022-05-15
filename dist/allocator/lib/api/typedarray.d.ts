export function typedArray(type: any, ...xs: any[]): any;
/**
 * WebGL numeric type constants. Use {@link GL2TYPE} to convert, if needed.
 *
 * {@link Type}
 * {@link GL2TYPE}
 * {@link TYPE2GL}
 */
export var GLType: any;
/**
 * Conversion from {@link GLType} to {@link Type} enums.
 */
export const GL2TYPE: {
    [x: number]: string;
};
export namespace TYPE2GL {
    const i8: any;
    const u8: any;
    const u8c: any;
    const i16: any;
    const u16: any;
    const i32: any;
    const u32: any;
    const f32: any;
    const f64: undefined;
}
export namespace SIZEOF {
    const u8_1: number;
    export { u8_1 as u8 };
    const u8c_1: number;
    export { u8c_1 as u8c };
    const i8_1: number;
    export { i8_1 as i8 };
    const u16_1: number;
    export { u16_1 as u16 };
    const i16_1: number;
    export { i16_1 as i16 };
    const u32_1: number;
    export { u32_1 as u32 };
    const i32_1: number;
    export { i32_1 as i32 };
    const f32_1: number;
    export { f32_1 as f32 };
    const f64_1: number;
    export { f64_1 as f64 };
}
export namespace FLOAT_ARRAY_CTORS {
    const f32_2: Float32ArrayConstructor;
    export { f32_2 as f32 };
    const f64_2: Float64ArrayConstructor;
    export { f64_2 as f64 };
}
export namespace INT_ARRAY_CTORS {
    const i8_2: Int8ArrayConstructor;
    export { i8_2 as i8 };
    const i16_2: Int16ArrayConstructor;
    export { i16_2 as i16 };
    const i32_2: Int32ArrayConstructor;
    export { i32_2 as i32 };
}
export namespace UINT_ARRAY_CTORS {
    const u8_2: Uint8ArrayConstructor;
    export { u8_2 as u8 };
    const u8c_2: Uint8ClampedArrayConstructor;
    export { u8c_2 as u8c };
    const u16_2: Uint16ArrayConstructor;
    export { u16_2 as u16 };
    const u32_2: Uint32ArrayConstructor;
    export { u32_2 as u32 };
}
export namespace TYPEDARRAY_CTORS { }
export function asNativeType(type: any): any;
export function asGLType(type: any): any;
export function asInt(...args: any[]): number[];
export function sizeOf(type: any): any;
export function typedArrayType(x: any): string;
export function uintTypeForSize(x: any): "u8" | "u16" | "u32";
export function intTypeForSize(x: any): "i32" | "i8" | "i16";
export function uintTypeForBits(x: any): "u8" | "u16" | "u32";
export function intTypeForBits(x: any): "i32" | "i8" | "i16";
//# sourceMappingURL=typedarray.d.ts.map