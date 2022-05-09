import {expect, describe, it} from "@jest/globals"
import {componentMacro} from "./index"

describe("component generation", () => {
    it("components are generated with correct key names and data types", () => {
        const position = componentMacro("position", {
            x: "f64",
            y: "f64",
            z: "f64"
        })
        const p = new position(10)
        expect(p.x).toBeInstanceOf(Float64Array)
        expect(p.y).toBeInstanceOf(Float64Array)
        expect(p.z).toBeInstanceOf(Float64Array)
        expect(p["&bufferPtrs"]).toBeInstanceOf(Int32Array)
        expect(p["&bufferPtrs"].length).toBe(3)
        expect(p.x.length).toBe(10)
        expect(p.y.length).toBe(10)
        expect(p.z.length).toBe(10)

        const animation = componentMacro("animation", {
            position: "i32",
            face: "i8"
        })
        const a = new animation(5)
        expect(a.face).toBeInstanceOf(Int8Array)
        expect(a.position).toBeInstanceOf(Int32Array)
        expect(a["&bufferPtrs"]).toBeInstanceOf(Int32Array)
        expect(a["&bufferPtrs"].length).toBe(2)
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
