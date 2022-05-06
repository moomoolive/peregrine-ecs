import {expect, describe, it} from "@jest/globals"
import {componentMacro} from "./index"

describe("component generation", () => {
    it("components are generated with correct key names and data types", () => {
        const position = componentMacro("position", {
            x: "f64",
            y: "f64",
            z: "f64"
        })
        const p = new position(5)
        expect(p["@memory"].x).toBeInstanceOf(Float64Array)
        expect(p["@memory"].y).toBeInstanceOf(Float64Array)
        expect(p["@memory"].z).toBeInstanceOf(Float64Array)

        const animation = componentMacro("animation", {
            position: "i32",
            face: "i8"
        })
        const a = new animation(5)
        expect(a["@memory"].face).toBeInstanceOf(Int8Array)
        expect(a["@memory"].position).toBeInstanceOf(Int32Array)
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
        const instance = new color(5)
        expect(typeof instance.set).toBe("function")

        /* component getters */
        expect(typeof instance.red).toBe("function")
        expect(typeof instance.blue).toBe("function")
        expect(typeof instance.green).toBe("function")

        /* component setters */
        expect(typeof instance.set_red).toBe("function")
        expect(typeof instance.set_blue).toBe("function")
        expect(typeof instance.set_green).toBe("function")
    })
})

describe("can set component via data buffer", () => {
    it("can set first index", () => {
        const health = componentMacro("health", {
            level: "i16",
            statusEffect: "u8"
        })
        const h = new health(10)
        const databuffer = new Float64Array([5_000, 50])
        /* in order to set entire component at once, a f64 array must be used */
        h.set(0, 0, databuffer)
        expect(h["@memory"].level[0]).toBe(databuffer[0])
        expect(h["@memory"].statusEffect[0]).toBe(databuffer[1])
    })

    it("can set last index", () => {
        const health = componentMacro("health", {
            level: "i16",
            statusEffect: "u8"
        })
        const h = new health(10)
        console.log(health.toString())
        const databuffer = new Float64Array([2, 212])
        h.set(9, 0, databuffer)

        /* these two are equivalent */
        expect(h["@memory"].level[9]).toBe(databuffer[0])
        expect(h.level(9)).toBe(databuffer[0])

        /* as well as these */
        expect(h["@memory"].statusEffect[9]).toBe(databuffer[1])
        expect(h.statusEffect(9)).toBe(databuffer[1])
    })
})

describe("can set component via setters", () => {
    it("can set first index", () => {
        const health = componentMacro("health", {
            level: "i16",
            statusEffect: "u8"
        })
        const h = new health(10)
        const databuffer = new Float64Array([5_000, 50])

        h.set_level(0, databuffer[0])
        h.set_statusEffect(0, databuffer[1])
        
        expect(h["@memory"].level[0]).toBe(databuffer[0])
        expect(h["@memory"].statusEffect[0]).toBe(databuffer[1])
    })

    it("can set last index", () => {
        const health = componentMacro("health", {
            level: "i16",
            statusEffect: "u8"
        })
        const h = new health(10)
        console.log(health.toString())
        const databuffer = new Float64Array([2, 212])


        h.set_level(9, databuffer[0])
        h.set_statusEffect(9, databuffer[1])

        /* these two are equivalent */
        expect(h["@memory"].level[9]).toBe(databuffer[0])
        expect(h.level(9)).toBe(databuffer[0])

        /* as well as these */
        expect(h["@memory"].statusEffect[9]).toBe(databuffer[1])
        expect(h.statusEffect(9)).toBe(databuffer[1])
    })
})