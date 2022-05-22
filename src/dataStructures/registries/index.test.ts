import {expect, describe, it} from "@jest/globals"
import {
    componentRegistryMacro, 
    registry_encoding,
    relationRegistryMacro,
} from "./index"
import {orderComponentsByName} from "../../components/index"
import {isImmutable} from "../../entities/ids"

describe("component registry", () => {
    it("should generate object will inputted keys", () => {
        const defs = {
            likeability: {x: "i32"},
            pets: {age: "i32", type: "i32"}
        } as const
        const names = orderComponentsByName(defs)
        const components = componentRegistryMacro<typeof defs>(names)
        expect(typeof components.likeability).toBe("number")
        expect(typeof components.pets).toBe("number")

        const defs2 = {
            position: {x: "f32", y: "f32", z: "f32"},
            velocity: {x: "f32", y: "f32", z: "f32"}
        } as const
        const names2 = orderComponentsByName(defs2)
        const components2 = componentRegistryMacro<typeof defs2>(
            names2
        )
        expect(typeof components2.position).toBe("number")
        expect(typeof components2.velocity).toBe("number")
    })

    it("component registry should be immutable", () => {
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

    it("component ids in registry should be marked as immutable", () => {
        const def = {
            likeability: {x: "i32"},
            pets: {age: "i32", type: "i32"}
        } as const
        const names = orderComponentsByName(def)
        const components = componentRegistryMacro<typeof def>(
            names
        )
        expect(isImmutable(components.likeability as number)).toBe(true)
        expect(isImmutable(components.pets as number)).toBe(true)
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

describe("relation registry (id registry generation)", () => {
    it("inputting incorrect type to relation registry should throw error", () => {
        expect(() => relationRegistryMacro(null as any)).toThrow()
        expect(() => relationRegistryMacro(0 as any)).toThrow()
        expect(() => relationRegistryMacro(true as any)).toThrow()
        expect(() => relationRegistryMacro("relations" as any)).toThrow()
        expect(() => relationRegistryMacro(Symbol() as any)).toThrow()
        expect(() => relationRegistryMacro(undefined as any)).toThrow()
        expect(() => relationRegistryMacro([] as any)).toThrow()
    })

    it("inputting incorrect entity type should throw error", () => {
        expect(() => relationRegistryMacro({rel: null} as any)).toThrow()
        expect(() => relationRegistryMacro({rel: undefined} as any)).toThrow()
        expect(() => relationRegistryMacro({rel: 2} as any)).toThrow()
        expect(() => relationRegistryMacro({rel: "no a real component"} as any)).toThrow()
        expect(() => relationRegistryMacro({rel: true} as any)).toThrow()
        expect(() => relationRegistryMacro({rel: Symbol()} as any)).toThrow()
    })

    it("should generate object with inputted keys", () => {
        const {registry: relations} = relationRegistryMacro({
            marriedTo: "immutable",
            eats: "immutable",
            livesIn: "reserved",
            hates: "immutable"
        })
        expect(typeof relations.eats).toBe("number")
        expect(typeof relations.livesIn).toBe("number")
        expect(typeof relations.hates).toBe("number")
        expect(typeof relations.marriedTo).toBe("number")
    })

    it("relations registry should be immutable", () => {
        const {registry: relations} = relationRegistryMacro({
            marriedTo: "immutable",
            eats: "immutable",
            livesIn: "reserved",
            hates: "immutable"
        })
        // @ts-ignore
        expect(() => relations.eats = 4).toThrow()
    })

    it("relations declared as immutable should have immutable ids, otherwise they shouldn't", () => {
        const {registry: relations} = relationRegistryMacro({
            marriedTo: "immutable",
            eats: "immutable",
            livesIn: "reserved",
            hates: "immutable"
        })
        expect(isImmutable(relations.marriedTo)).toBe(true)
        expect(isImmutable(relations.eats)).toBe(true)
        expect(isImmutable(relations.livesIn)).toBe(false)
        expect(isImmutable(relations.hates)).toBe(true)
    })
})