import {expect, describe, it, afterEach} from "@jest/globals"
import {createComponentAllocator} from "../allocator/index"
import {componentMacro} from "./index"

const allocator = createComponentAllocator(1_024, false)

afterEach(() => {
    allocator.freeAll()
})

describe("component generation", () => {
    it("components are generated with correct key names and data types", () => {
        const position = componentMacro("position", {
            x: "f64",
            y: "f64",
            z: "f64"
        })
        const p = new position(10, allocator)
        expect(p.x).toBeInstanceOf(Float64Array)
        expect(p.y).toBeInstanceOf(Float64Array)
        expect(p.z).toBeInstanceOf(Float64Array)
        expect(p["&allocatorPtrs"]).toBeInstanceOf(Int32Array)
        expect(p["&allocatorPtrs"].length).toBe(position.tokens.length + 1)
        expect(p.x.length).toBe(10)
        expect(p.y.length).toBe(10)
        expect(p.z.length).toBe(10)

        const animation = componentMacro("animation", {
            position: "i32",
            face: "i8"
        })
        const a = new animation(5, allocator)
        expect(a.face).toBeInstanceOf(Int8Array)
        expect(a.position).toBeInstanceOf(Int32Array)
        expect(a["&allocatorPtrs"]).toBeInstanceOf(Int32Array)
        expect(a["&allocatorPtrs"].length).toBe(animation.tokens.length + 1)
        expect(a.face.length).toBe(5)
        expect(a.position.length).toBe(5)
    })

    it("utility methods exist for generated components", () => {
        const color = componentMacro("color", {
            red: 'u8',
            blue: "u8",
            green: "u8"
        })
        expect(color.def).toEqual({
            red: 'u8',
            blue: "u8",
            green: "u8"
        })
        expect(color.bytesPerElement).toBe(3)
    })
})
