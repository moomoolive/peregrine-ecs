/**
 * Stub/polyfill implementation of {@link IMemPoolArray}, merely delegating to
 * JS typed array ctors with no further management of returned arrays.
 */
export class NativePool {
    mallocAs(type: any, num: any): any;
    callocAs(type: any, num: any, fill?: number): any;
    reallocArray(src: any, num: any): any;
    free(_: any): boolean;
    freeAll(): void;
    release(): boolean;
}
//# sourceMappingURL=native.d.ts.map