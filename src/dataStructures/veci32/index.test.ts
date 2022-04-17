import {expect, describe, it} from "@jest/globals"
import {Veci32} from "./index"

describe("adding/removing elements", () => {
    it("can add elements", () => {
        const v = new Veci32(5)
        Veci32.push(v, 2)
        expect(v.memory[0]).toBe(2)
        expect(v.length).toBe(1)

        Veci32.push(v, -2)
        expect(v.memory[1]).toBe(-2)
        expect(v.length).toBe(2)
    })

    it("resizes when capacity is met", () => {
        const v = new Veci32(1)
        expect(v.memory.length).toBe(1)
        Veci32.push(v, 2)
        expect(v.memory[0]).toBe(2)
        expect(v.length).toBe(1)

        Veci32.push(v, -2)
        expect(v.memory[0]).toBe(2)
        expect(v.memory[1]).toBe(-2)
        expect(v.length).toBe(2)
        expect(v.memory.length).toBeGreaterThan(1)
    })

    it("elements can be removed", () => {
        const v = new Veci32(5)
        Veci32.push(v, 2)
        Veci32.push(v, -2)
        expect(v.length).toBe(2)

        expect(Veci32.pop(v)).toBe(-2)
        expect(v.length).toBe(1)
        expect(Veci32.pop(v)).toBe(2)
        expect(v.length).toBe(0)

        expect(Veci32.pop(v)).toBe(undefined)
        expect(v.length).toBe(0)
        expect(Veci32.pop(v)).toBe(undefined)
        expect(v.length).toBe(0)
    })

    it("capacity should shrink if too much memory is unused", () => {
        const v = new Veci32(5_000)
        Veci32.push(v, 2)
        expect(v.memory.length).toBe(5_000)

        Veci32.pop(v)
        expect(v.memory.length).toBeLessThan(5_000)
    })
})

describe("expanding/shrinking capacity", () => {
    it("reserve adds the given amount of memory to vec", () => {
        const v = new Veci32(1)
        Veci32.reserve(v, 10)
        expect(v.memory.length).toBe(10)
        expect(v.length).toBe(0)

        /* does nothing if capacity is as much as requested */
        Veci32.reserve(v, 10)
        expect(v.memory.length).toBe(10)
        expect(v.length).toBe(0)

        Veci32.reserve(v, 5)
        expect(v.memory.length).toBe(10)
        expect(v.length).toBe(0)
    })

    it("shrinkTo shrinks vec capacity to given amount", () => {
        const v = new Veci32(5)
        Veci32.push(v, 2)
        Veci32.push(v, -2)

        Veci32.shrinkTo(v, 2)
        expect(v.memory.length).toBe(4)
        expect(v.length).toBe(2)

        Veci32.shrinkTo(v, 0)
        expect(v.memory.length).toBe(2)
        expect(v.length).toBe(2)

        /* negative min capacity does nothing */
        Veci32.shrinkTo(v, -10)
        expect(v.memory.length).toBe(2)
        expect(v.length).toBe(2)
    })
})