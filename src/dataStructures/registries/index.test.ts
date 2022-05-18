import {expect, describe, it} from "@jest/globals"
import {
    componentRegistryMacro, 
    registry_encoding,
} from "./index"
import {standard_entity} from "../../entities/index"
import {orderComponentsByName} from "../../components/index"

describe("component registry", () => {
    it("should generate object will inputted keys", () => {
        const defs = {
            likeability: {x: "i32"},
            pets: {age: "i32", type: "i32"}
        } as const
        const names = orderComponentsByName(defs)
        const components = componentRegistryMacro<typeof defs>(names)
        expect(components.likeability).toBe(
            standard_entity.reserved_end + 0
        )
        expect(components.pets).toBe(
            standard_entity.reserved_end + 1
        )

        const defs2 = {
            position: {x: "f32", y: "f32", z: "f32"},
            velocity: {x: "f32", y: "f32", z: "f32"}
        } as const
        const names2 = orderComponentsByName(defs2)
        const components2 = componentRegistryMacro<typeof defs2>(
            names2
        )
        expect(components2.position).toBe(
            standard_entity.reserved_end + 0
        )
        expect(components2.velocity).toBe(
            standard_entity.reserved_end + 1)
    })

    it("should throw error if attempting to set key", () => {
        const def = {
            likeability: {x: "i32"},
            pets: {age: "i32", type: "i32"}
        } as const
        const names = orderComponentsByName(def)
        const components = componentRegistryMacro<typeof def>(
            names
        )
        // @ts-ignore
        expect(() => components.likeability = 2).toThrow()
    })

    it("should throw error if input is object with no keys", () => {
        expect(() => componentRegistryMacro([])).toThrow()
    })

    it("should throw error if input has more keys than maximum", () => {
        const max: string[] = []
        for (let i = 0; i < registry_encoding.max_components + 1; i++) {
            max.push("field" + i.toString())
        }
        expect(() => componentRegistryMacro(max)).toThrow()
    })
})