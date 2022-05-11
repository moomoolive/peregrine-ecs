import {expect, describe, it, afterEach} from "@jest/globals"
import {createComponentAllocator} from "../allocator/index"
import {componentMacro} from "./index"

const allocator = createComponentAllocator(1_024, false)

afterEach(() => {allocator.freeAll()})

describe("component generation", () => {
    it("components are generated with correct key names and data types", () => {
        const position = componentMacro("position", {
            x: "f64",
            y: "f64",
            z: "f64"
        })
        console.log(position.toString())
        const pos = new position(10, allocator)
        const p = pos.data
        expect(pos.databuffers.length).toBe(3)
        expect(pos.databuffers[0]).toBeInstanceOf(Float64Array)
        expect(pos.databuffers[1]).toBeInstanceOf(Float64Array)
        expect(pos.databuffers[2]).toBeInstanceOf(Float64Array)
        expect(p.x).toBeInstanceOf(Float64Array)
        expect(p.y).toBeInstanceOf(Float64Array)
        expect(p.z).toBeInstanceOf(Float64Array)
        expect(pos.$allocatorPtrs).toBeInstanceOf(Int32Array)
        expect(pos.$allocatorPtrs.length).toBe(position.tokens.length)
        expect(p.x.length).toBe(10)
        expect(p.y.length).toBe(10)
        expect(p.z.length).toBe(10)

        const animation = componentMacro("animation", {
            position: "i32",
            face: "i8"
        })
        const anim = new animation(5, allocator)
        const a = anim.data
        expect(anim.databuffers[0]).toBeInstanceOf(Int32Array)
        expect(anim.databuffers[1]).toBeInstanceOf(Int8Array)
        expect(a.face).toBeInstanceOf(Int8Array)
        expect(a.position).toBeInstanceOf(Int32Array)
        expect(anim.$allocatorPtrs).toBeInstanceOf(Int32Array)
        expect(anim.$allocatorPtrs.length).toBe(animation.tokens.length)
        expect(a.face.length).toBe(5)
        expect(a.position.length).toBe(5)
    })

    it("utility methods exist for generated components", () => {
        const color = componentMacro("color", {
            red: 'u8',
            blue: "u8",
            green: "u8"
        })
        expect(JSON.parse(color.stringifiedDef)).toEqual({
            red: 'u8',
            blue: "u8",
            green: "u8"
        })
        expect(typeof color.proxyClass).toBe("function")
        console.log(color.proxyClass.toString())
        expect(color.bytesPerElement).toBe(3)
        expect(color.tokens).toEqual([
            {
                name: "red", 
                type: "u8", 
                ptrOffset: 0
            },
            {
                name: "blue", 
                type: "u8", 
                ptrOffset: 1
            },
            {
                name: "green", 
                type: "u8", 
                ptrOffset: 2
            },
            {
                name: "$component_segments_ptr", 
                type: "i32", 
                ptrOffset: Object.keys({
                    red: 'u8',
                    blue: "u8",
                    green: "u8"
                }).length
            }
        ])
    })
})
