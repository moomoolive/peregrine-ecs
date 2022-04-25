import {expect, describe, it} from "@jest/globals"
import {
    componentRegistryMacro, 
    MAX_COMPONENTS,
    debugComponent
} from "./index"
import {componentMacro} from "../../components/index"

describe("component registry", () => {
    it("should generate object will inputted keys", () => {
        const components = componentRegistryMacro({
            likeability: {x: "i8"},
            pets: {age: "u16", type: "u8"}
        })
        expect(components.likeability).toBe(0)
        expect(components.pets).toBe(1)

        const components2 = componentRegistryMacro({
            position: {x: "f32", y: "f32", z: "f32"},
            velocity: {x: "f32", y: "f32", z: "f32"}
        })
        expect(components2.position).toBe(0)
        expect(components2.velocity).toBe(1)
    })

    it("should throw error if attempting to set key", () => {
        const components = componentRegistryMacro({
            likeability: {x: "i8"},
            pets: {age: "u16", type: "u8"}
        })
        // @ts-ignore
        expect(() => components.likeability = 2).toThrow()
    })

    it("should throw error if input is object with no keys", () => {
        expect(() => componentRegistryMacro({})).toThrow()
    })

    it("should throw error if input has more keys than maximum", () => {
        const max: Record<string, {}> = {}
        for (let i = 0; i < MAX_COMPONENTS + 1; i++) {
            max["field" + i.toString()] = {}
        }
        expect(() => componentRegistryMacro(max)).toThrow()
    })
})

describe("component registry debug tools", () => {
    it("debug tools returns correct metrics", () => {
        const defs = {
            cat: {cuteness: "u8", angry: "u8"},
            bird: {maxFlightHeight: "i32", weight: "u16"}
        } as const
        const components = [
            componentMacro("cat", defs.cat),
            componentMacro("bird", defs.bird),
        ]
        const registry = componentRegistryMacro(defs)
        {
            const {
                def, name, bytesPerElement, id
            } = debugComponent(
                registry.cat, 
                components
            )
            expect(def).toEqual({cuteness: "u8", angry: "u8"})
            expect(id).toBe(0)
            expect(name).toBe("cat")
            expect(bytesPerElement).toBe(2)
        }
        {
            const {
                def, name, bytesPerElement, id
            } = debugComponent(
                registry.bird, 
                components
            )
            expect(def).toEqual({maxFlightHeight: "i32", weight: "u16"})
            expect(id).toBe(1)
            expect(name).toBe("bird")
            expect(bytesPerElement).toBe(6)
        }
    })
})