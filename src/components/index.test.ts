import {expect, describe, it} from "@jest/globals"
import {componentViewMacro} from "./index"

describe("component generation", () => {
    it("components are generated with correct key names and data types", () => {
        const {
            View,
            componentSegements,
            bytesPerElement,
            bytesPerField,
            memoryConstructor,
            tokens,
            id
        } = componentViewMacro(0, "position", {
            x: "f64",
            y: "f64",
            z: "f64"
        })
        expect(id).toBe(0)
        expect(componentSegements).toBe(3)
        expect(bytesPerField).toBe(8)
        expect(bytesPerElement).toBe(24)
        expect(memoryConstructor).toBe(Float64Array)
        expect(tokens.memoryType).toBe("f64")
        expect(tokens.fields).toEqual([
            {name: "x", databufferOffset: 0},
            {name: "y", databufferOffset: 1},
            {name: "z", databufferOffset: 2},
        ])
        const databuffers = []
        for (let i = 0; i < componentSegements; i++) {
            databuffers.push(new memoryConstructor(1))
        }
        const pos = new View(databuffers)
        expect(pos.x).toBeInstanceOf(Float64Array)
        expect(pos.y).toBeInstanceOf(Float64Array)
        expect(pos.z).toBeInstanceOf(Float64Array)
        
        {
        const {
            View,
            componentSegements,
            bytesPerElement,
            bytesPerField,
            memoryConstructor,
            tokens,
            id
        } = componentViewMacro(1, "animation", {
            position: "i32",
            face: "i32"
        })
        expect(id).toBe(1)
        expect(componentSegements).toBe(2)
        expect(bytesPerField).toBe(4)
        expect(bytesPerElement).toBe(8)
        expect(memoryConstructor).toBe(Int32Array)
        expect(tokens.memoryType).toBe("i32")
        expect(tokens.fields).toEqual([
            {name: "position", databufferOffset: 0},
            {name: "face", databufferOffset: 1},
        ])
        const databuffers = []
        for (let i = 0; i < componentSegements; i++) {
            databuffers.push(new memoryConstructor(1))
        }
        const pos = new View(databuffers)
        expect(pos.position).toBeInstanceOf(Int32Array)
        expect(pos.face).toBeInstanceOf(Int32Array)
        }
    })
})
