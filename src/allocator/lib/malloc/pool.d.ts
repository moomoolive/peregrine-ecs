import { Type, TypedArray } from "@thi.ng/api/typedarray";
import type { Pow2 } from "@thi.ng/binary";
import type { IMemPool, MemPoolOpts, MemPoolStats } from "./api.js";
export declare class MemPool implements IMemPool {
    buf: ArrayBufferLike;
    protected readonly start: number;
    protected u8: Uint8Array;
    protected u32: Uint32Array;
    protected state: Uint32Array;
    constructor(opts?: Partial<MemPoolOpts>);
    stats(): Readonly<MemPoolStats>;
    callocAs<T extends Type>(type: T, num: number, fill?: number): import("@thi.ng/api/typedarray").TypedArrayTypeMap[T] | undefined;
    mallocAs<T extends Type>(type: T, num: number): import("@thi.ng/api/typedarray").TypedArrayTypeMap[T] | undefined;
    calloc(bytes: number, fill?: number): number;
    malloc(bytes: number): number;
    private mallocTop;
    realloc(ptr: number, bytes: number): number;
    private reallocBlock;
    reallocArray<T extends TypedArray>(array: T, num: number): T | undefined;
    /* modified to make interface only accept pointers */
    free(ptr: number): boolean;
    freeAll(): void;
    release(): boolean;
    protected get align(): Pow2;
    protected set align(x: Pow2);
    protected get end(): number;
    protected set end(x: number);
    protected get top(): number;
    protected set top(x: number);
    protected get _free(): number;
    protected set _free(block: number);
    protected get _used(): number;
    protected set _used(block: number);
    protected get doCompact(): boolean;
    protected set doCompact(flag: boolean);
    protected get doSplit(): boolean;
    protected set doSplit(flag: boolean);
    protected get minSplit(): number;
    protected set minSplit(x: number);
    protected blockSize(block: number): number;
    /**
     * Sets & returns given block size.
     *
     * @param block -
     * @param size -
     */
    protected setBlockSize(block: number, size: number): number;
    protected blockNext(block: number): number;
    /**
     * Sets block next pointer to `next`. Use zero to indicate list end.
     *
     * @param block -
     */
    protected setBlockNext(block: number, next: number): void;
    /**
     * Initializes block header with given `size` and `next` pointer. Returns `block`.
     *
     * @param block -
     * @param size -
     * @param next -
     */
    protected initBlock(block: number, size: number, next: number): number;
    protected unlinkBlock(prev: number, block: number): void;
    protected splitBlock(block: number, blockSize: number, excess: number): void;
    protected initialTop(_align?: Pow2): number;
    /**
     * Traverses free list and attempts to recursively merge blocks
     * occupying consecutive memory regions. Returns true if any blocks
     * have been merged. Only called if `compact` option is enabled.
     */
    protected compact(): boolean;
    /**
     * Inserts given block into list of free blocks, sorted by address.
     *
     * @param block -
     */
    protected insert(block: number): void;
}
//# sourceMappingURL=pool.d.ts.map