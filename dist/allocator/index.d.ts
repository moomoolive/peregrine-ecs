import { MemPool, MemPoolStats } from "./lib/malloc/index";
export declare function createComponentAllocator(byteSize: number, workerThread: boolean): MemPool;
export declare const enum allocator_encoding {
    failed_to_allocate = 0
}
export interface Allocator {
    buf: ArrayBufferLike;
    malloc: (bytes: number) => number;
    free: (ptr: number) => boolean;
    freeAll: () => void;
    stats: () => AllocatorDebugInfo;
}
export declare type AllocatorDebugInfo = Readonly<MemPoolStats>;
export declare function debugComponentAllocator(allocator: Allocator): AllocatorDebugInfo;
//# sourceMappingURL=index.d.ts.map