import {MemPool, MemPoolStats} from "@thi.ng/malloc/index"

export function createComponentAllocator(
    byteSize: number,
    workerThread: boolean
): MemPool {
    return new MemPool({
        buf: new SharedArrayBuffer(byteSize),
        skipInitialization: workerThread 
    })
}

export type Allocator = MemPool
export type AllocatorDebugInfo = Readonly<MemPoolStats>

export function debugComponentAllocator(
    allocator: Allocator
): AllocatorDebugInfo {
    return allocator.stats()
}
