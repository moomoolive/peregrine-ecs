import { MemPool, MemPoolStats } from "@thi.ng/malloc/index";
export declare function createComponentAllocator(byteSize: number, workerThread: boolean): MemPool;
export declare type Allocator = MemPool;
export declare type AllocatorDebugInfo = Readonly<MemPoolStats>;
export declare function debugComponentAllocator(allocator: Allocator): AllocatorDebugInfo;
//# sourceMappingURL=index.d.ts.map