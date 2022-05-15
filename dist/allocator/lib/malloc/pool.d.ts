export class MemPool {
    constructor(opts?: {});
    buf: any;
    start: any;
    u8: Uint8Array;
    u32: Uint32Array;
    state: Uint32Array;
    set align(arg: number);
    get align(): number;
    set doCompact(arg: boolean);
    get doCompact(): boolean;
    set doSplit(arg: boolean);
    get doSplit(): boolean;
    set minSplit(arg: number);
    get minSplit(): number;
    set end(arg: number);
    get end(): number;
    set top(arg: number);
    get top(): number;
    set _free(arg: number);
    get _free(): number;
    set _used(arg: number);
    get _used(): number;
    stats(): {
        free: {
            count: number;
            size: number;
        };
        used: {
            count: number;
            size: number;
        };
        top: number;
        available: number;
        total: any;
    };
    callocAs(type: any, num: any, fill?: number): any;
    mallocAs(type: any, num: any): any;
    calloc(bytes: any, fill?: number): any;
    malloc(bytes: any): any;
    mallocTop(block: any, prev: any, blockSize: any, paddedSize: any, isTop: any): any;
    realloc(ptr: any, bytes: any): any;
    reallocBlock(block: any, bytes: any): any[];
    reallocArray(array: any, num: any): any;
    free(ptrOrArray: any): boolean;
    freeAll(): void;
    release(): boolean;
    blockSize(block: any): number;
    /**
     * Sets & returns given block size.
     *
     * @param block -
     * @param size -
     */
    setBlockSize(block: any, size: any): any;
    blockNext(block: any): number;
    /**
     * Sets block next pointer to `next`. Use zero to indicate list end.
     *
     * @param block -
     */
    setBlockNext(block: any, next: any): void;
    /**
     * Initializes block header with given `size` and `next` pointer. Returns `block`.
     *
     * @param block -
     * @param size -
     * @param next -
     */
    initBlock(block: any, size: any, next: any): any;
    unlinkBlock(prev: any, block: any): void;
    splitBlock(block: any, blockSize: any, excess: any): void;
    initialTop(_align?: number): number;
    /**
     * Traverses free list and attempts to recursively merge blocks
     * occupying consecutive memory regions. Returns true if any blocks
     * have been merged. Only called if `compact` option is enabled.
     */
    compact(): boolean;
    /**
     * Inserts given block into list of free blocks, sorted by address.
     *
     * @param block -
     */
    insert(block: any): void;
}
//# sourceMappingURL=pool.d.ts.map