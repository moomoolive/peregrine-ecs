export function createMemory(capacity: number): Int32Array {
    const bytes = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * capacity)
    return new Int32Array(bytes)
}

const enum defaults {
    collectionLimit = 34
}

export class Veci32 {
    static push(vec: Veci32, i32: number) {
        const mem = vec.memory
        const mutIndex = vec.length
        vec.length += 1
        if (vec.length > mem.length) {
            const newMem = createMemory(mem.length * 2)
            newMem.set(mem, 0)
            vec.memory = newMem
        }
        vec.memory[mutIndex] = i32
    }

    static pop(vec: Veci32): number | undefined {
        const len = vec.length
        const mem = vec.memory
        if ((mem.length - len) > defaults.collectionLimit) {
            const newMem = createMemory(len + defaults.collectionLimit)
            for (let i = 0; i < len; i += 1) {
                newMem[i] = mem[i]
            }
            vec.memory = newMem
        }
        if (len < 1) {
            return
        }
        const val = vec.memory[len - 1]
        vec.length -= 1
        return val
    }

    static reserve(vec: Veci32, additional: number) {
        const diff = vec.memory.length - vec.length
        const additionalMemory = additional - diff
        if (additionalMemory < 1) {
            return
        }
        const newMem = createMemory(vec.memory.length + additionalMemory)
        newMem.set(vec.memory, 0)
        vec.memory = newMem
    }

    static shrinkTo(vec: Veci32, minCapacity: number) {
        if (minCapacity < 0) {
            return
        }
        const len = vec.length
        const mem = vec.memory
        const currentCapcity = mem.length - len
        if (currentCapcity <= minCapacity) {
            return
        }
        const newMem = createMemory(len + minCapacity)
        for (let i = 0; i < len; i += 1) {
            newMem[i] = mem[i]
        }
        vec.memory = newMem
    }

    memory: Int32Array
    length: number

    constructor(capacity: number) {
        this.memory = createMemory(capacity)
        this.length = 0
    }
}
