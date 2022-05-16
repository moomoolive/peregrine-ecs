import {expect, describe, it} from "@jest/globals"
import {
    componentRegistryMacro, 
    MAX_COMPONENTS,
} from "./index"
import {standard_entity} from "../../entities/index"

describe("component registry", () => {
    it("should generate object will inputted keys", () => {
        const components = componentRegistryMacro({
            likeability: {x: "i32"},
            pets: {age: "i32", type: "i32"}
        })
        expect(components.likeability).toBe(
            standard_entity.reserved_end + 0
        )
        expect(components.pets).toBe(
            standard_entity.reserved_end + 1
        )

        const components2 = componentRegistryMacro({
            position: {x: "f32", y: "f32", z: "f32"},
            velocity: {x: "f32", y: "f32", z: "f32"}
        })
        expect(components2.position).toBe(
            standard_entity.reserved_end + 0
        )
        expect(components2.velocity).toBe(
            standard_entity.reserved_end + 1)
    })

    it("should throw error if attempting to set key", () => {
        const components = componentRegistryMacro({
            likeability: {x: "i32"},
            pets: {age: "i32", type: "i32"}
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