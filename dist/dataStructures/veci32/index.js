"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Veci32 = exports.SharedInt32Array = void 0;
const BYTES = Int32Array.BYTES_PER_ELEMENT;
/**
 * Returns a Int32Array that is
 * backed by a SharedArrayBuffer
 *
 * @param {number} capacity number of elements
 * array can carry
 * @returns {Int32Array}
 */
function SharedInt32Array(capacity) {
    const bytes = new SharedArrayBuffer(BYTES * capacity);
    return new Int32Array(bytes);
}
exports.SharedInt32Array = SharedInt32Array;
class Veci32 {
    constructor(capacity) {
        this.memory = SharedInt32Array(capacity);
        this.length = 0;
    }
    static push(vec, i32) {
        const mem = vec.memory;
        const mutIndex = vec.length;
        vec.length += 1;
        if (vec.length > mem.length) {
            const newMem = SharedInt32Array(mem.length * 2);
            newMem.set(mem, 0);
            vec.memory = newMem;
        }
        vec.memory[mutIndex] = i32;
    }
    static pop(vec) {
        const len = vec.length;
        const mem = vec.memory;
        if ((mem.length - len) > 34 /* collectionLimit */) {
            const newMem = SharedInt32Array(len + 34 /* collectionLimit */);
            for (let i = 0; i < len; i += 1) {
                newMem[i] = mem[i];
            }
            vec.memory = newMem;
        }
        if (len < 1) {
            return;
        }
        const val = vec.memory[len - 1];
        vec.length -= 1;
        return val;
    }
    static reserve(vec, additional) {
        const diff = vec.memory.length - vec.length;
        const additionalMemory = additional - diff;
        if (additionalMemory < 1) {
            return;
        }
        const newMem = SharedInt32Array(vec.memory.length + additionalMemory);
        newMem.set(vec.memory, 0);
        vec.memory = newMem;
    }
    static shrinkTo(vec, minCapacity) {
        if (minCapacity < 0) {
            return;
        }
        const len = vec.length;
        const mem = vec.memory;
        const currentCapcity = mem.length - len;
        if (currentCapcity <= minCapacity) {
            return;
        }
        const newMem = SharedInt32Array(len + minCapacity);
        for (let i = 0; i < len; i += 1) {
            newMem[i] = mem[i];
        }
        vec.memory = newMem;
    }
}
exports.Veci32 = Veci32;
