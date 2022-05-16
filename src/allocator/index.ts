/* 
this import is a slightly modified fork of the 
awesome "@thi.ng/malloc" npm package (v6.1.6).
Check out the docs inside the library: /lib/malloc/readme.md
*/
import {MemPool, MemPoolStats} from "./lib/malloc/index"
import {bytes} from "../consts"

export function createComponentAllocator(
    byteSize: number,
    workerThread: boolean
): MemPool {
    return new MemPool({
        buf: new SharedArrayBuffer(byteSize),
        skipInitialization: workerThread 
    })
}

export const enum allocator_encoding {
    failed_to_allocate = 0
}

export interface Allocator {
    buf: ArrayBufferLike
    malloc: (bytes: number) => number
    free: (ptr: number) => boolean
    realloc: (ptr: number, bytes: number) => number
    freeAll: () => void
    stats: () => AllocatorDebugInfo
}
export type AllocatorDebugInfo = Readonly<MemPoolStats>

export function debugComponentAllocator(
    allocator: Allocator
): AllocatorDebugInfo {
    return allocator.stats()
}

export function i32Malloc(
    allocator: Allocator,
    size: number
): Int32Array {
    const ptr = allocator.malloc(size * bytes.i32)
    return new Int32Array(allocator.buf, ptr, size)
}