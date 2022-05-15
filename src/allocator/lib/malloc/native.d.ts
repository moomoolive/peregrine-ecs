import { Type, TypedArray, TypedArrayTypeMap } from "@thi.ng/api/typedarray";
import type { IMemPoolArray } from "./api.js";
/**
 * Stub/polyfill implementation of {@link IMemPoolArray}, merely delegating to
 * JS typed array ctors with no further management of returned arrays.
 */
export declare class NativePool implements IMemPoolArray {
    mallocAs<T extends Type>(type: T, num: number): TypedArrayTypeMap[T] | undefined;
    callocAs<T extends Type>(type: T, num: number, fill?: number): TypedArrayTypeMap[T] | undefined;
    reallocArray<T extends TypedArray>(src: T, num: number): T | undefined;
    free(_: number | TypedArray): boolean;
    freeAll(): void;
    release(): boolean;
}
//# sourceMappingURL=native.d.ts.map