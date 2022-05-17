import { MemPool, MemPoolStats } from "@thi.ng/malloc";
export declare function createComponentAllocator(byteSize: number, workerThread: boolean): MemPool;
export declare const enum allocator_encoding {
    failed_to_allocate = 0
}
export interface Allocator {
    buf: ArrayBufferLike;
    malloc: (bytes: number) => number;
    free: (ptr: number) => boolean;
    realloc: (ptr: number, bytes: number) => number;
    freeAll: () => void;
    stats: () => AllocatorDebugInfo;
}
export declare type AllocatorDebugInfo = Readonly<MemPoolStats>;
export declare function debugComponentAllocator(allocator: Allocator): AllocatorDebugInfo;
export declare function i32Malloc(allocator: Allocator, size: number): Int32Array;
//# sourceMappingURL=index.d.ts.map