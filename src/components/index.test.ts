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
        expect(p.x).toBeInstanceOf(Float64Array)
        expect(p.y).toBeInstanceOf(Float64Array)
        expect(p.z).toBeInstanceOf(Float64Array)

        const animation = componentMacro("animation", {
            position: "i32",
            face: "i32"
        })
        const a = new animation(5)
        expect(a.face).toBeInstanceOf(Int32Array)
        expect(a.position).toBeInstanceOf(Int32Array)
    })

    it("static utility methods exist for generated components", () => {
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
        expect(typeof color.push).toBe("function")
        expect(typeof color.pop).toBe("function")
        expect(typeof color.consume).toBe("function")
    })
})

describe("pushing elements", () => {
    it("elements can be added", () => {
        const npc = componentMacro("npc", {
            health: "u16",
            beauty: "u8"
        })
        const npcs = new npc(5)
        
        let len = 0
        len = npc.push(npcs, {health: 100, beauty: 1}, len)
        expect(len).toBe(1)
        expect(npcs.beauty[0]).toBe(1)
        expect(npcs.health[0]).toBe(100)

        len = npc.push(npcs, {health: 222, beauty: 188}, len)
        expect(len).toBe(2)
        expect(npcs.beauty[1]).toBe(188)
        expect(npcs.health[1]).toBe(222)
    })

    it("component should resize if capacity has been surpassed", () => {
        const npc = componentMacro("npc", {
            health: "u16",
            beauty: "u8"
        })
        const npcs = new npc(1)
        const capacity = npcs.beauty.length
        let len = 0
        len = npc.push(npcs, {health: 100, beauty: 1}, len)
        expect(len).toBe(1)
        expect(npcs.beauty[0]).toBe(1)
        expect(npcs.health[0]).toBe(100)

        len = npc.push(npcs, {health: 222, beauty: 188}, len)
        expect(len).toBe(2)
        expect(npcs.beauty[1]).toBe(188)
        expect(npcs.health[1]).toBe(222)
        expect(npcs.beauty.length).toBeGreaterThan(capacity)
    })
})

describe("poping elements", () => {
    it("should be able to pop elements", () => {
        const chicken = componentMacro("chicken", {
            weight: "i32",
            tastiness: "u8"
        })
        const chickens = new chicken(10)
        let len = 0
        len = chicken.push(chickens, {weight: 55, tastiness: 2}, len)
        expect(chickens.tastiness[0]).toBe(2)
        expect(chickens.weight[0]).toBe(55)
        expect(len).toBe(1)

        len = chicken.pop(chickens, len)
        expect(len).toBe(0)
    })

    it("poping should do nothing if length is 0", () => {
        const chicken = componentMacro("chicken", {
            weight: "i32",
            tastiness: "u8"
        })
        const chickens = new chicken(10)
        let len = 0
        len = chicken.pop(chickens, len)
        expect(len).toBe(0)

        len = chicken.pop(chickens, len)
        len = chicken.pop(chickens, len)
        len = chicken.pop(chickens, len)
        expect(len).toBe(0)
    })

    it("pop should garbage collect memory if too much unused memory", () => {
        const chicken = componentMacro("chicken", {
            weight: "i32",
            tastiness: "u8"
        })
        const chickens = new chicken(10_000)
        let len = 0
        len = chicken.push(chickens, {weight: 55, tastiness: 2}, len)
        len = chicken.push(chickens, {weight: 54, tastiness: 2}, len)
        len = chicken.push(chickens, {weight: 53, tastiness: 2}, len)
        expect(len).toBe(3)
        const capacity = chickens.tastiness.length

        len = chicken.pop(chickens, len)
        /* make sure non-popped elements exist */
        expect(chickens.weight[1]).toBe(54)
        expect(chickens.weight[0]).toBe(55)
        expect(len).toBe(2)
        expect(chickens.tastiness.length).toBeLessThan(capacity)
    })
})

describe("debug tools", () => {
    it("component class should have inputted name", () => {
        const chicken = componentMacro("chicken", {
            weight: "i32",
            tastiness: "u8"
        })
        expect(chicken.name).toBe("chicken")
        const npc = componentMacro("npc", {
            health: "u16",
            beauty: "u8"
        })
        expect(npc.name).toBe("npc")
        const color = componentMacro("color", {
            red: 'u8',
            blue: "u8",
            green: "u8"
        })
        expect(color.name).toBe("color")
    })
})