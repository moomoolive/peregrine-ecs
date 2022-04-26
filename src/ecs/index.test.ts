import {expect, describe, it} from "@jest/globals"
import {defineEcs} from "./index"

describe("ecs defines components correctly", () => {
    it("should be able to retrieve correct debug info about component", () => {
        const Ecs = defineEcs({
            components: {
                position: {x: "f64", y: "f64", z: "f64"},
                velocity: {x: "f64", y: "f64", z: "f64"},
                npcs: {hair: "u16", health: "u16"}
            }
        })
        const ecs = new Ecs()
        ecs.updateEntity(0)
            .remove(1)
            .update()
        {
            const {
                definition,
                bytesPerElement,
                name,
                id
            } = ecs.debugger.componentInfo(ecs.components.position)
            expect(definition).toEqual({x: "f64", y: "f64", z: "f64"})
            expect(bytesPerElement).toBe(24)
            expect(name).toBe("position")
            expect(id).toBe(0)
        }
        {
            const {
                definition,
                bytesPerElement,
                name,
                id
            } = ecs.debugger.componentInfo(ecs.components.velocity)
            expect(definition).toEqual({x: "f64", y: "f64", z: "f64"})
            expect(bytesPerElement).toBe(24)
            expect(name).toBe("velocity")
            expect(id).toBe(1)
        }
        {
            const {
                definition,
                bytesPerElement,
                name,
                id
            } = ecs.debugger.componentInfo(ecs.components.npcs)
            expect(definition).toEqual({hair: "u16", health: "u16"})
            expect(bytesPerElement).toBe(4)
            expect(name).toBe("npcs")
            expect(id).toBe(2)
        }
    })

    it("should be able to retrieve all component debug info at once", () => {
        const Ecs = defineEcs({
            components: {
                position: {x: "f64", y: "f64", z: "f64"},
                velocity: {x: "f64", y: "f64", z: "f64"},
                npcs: {hair: "u16", health: "u16"}
            }
        })
        const ecs = new Ecs()
        const debug = ecs.debugger.allComponents()
        {
            const {
                definition,
                bytesPerElement,
                name,
                id
            } = debug[0]
            expect(definition).toEqual({x: "f64", y: "f64", z: "f64"})
            expect(bytesPerElement).toBe(24)
            expect(name).toBe("position")
            expect(id).toBe(0)
        }
        {
            const {
                definition,
                bytesPerElement,
                name,
                id
            } = debug[1]
            expect(definition).toEqual({x: "f64", y: "f64", z: "f64"})
            expect(bytesPerElement).toBe(24)
            expect(name).toBe("velocity")
            expect(id).toBe(1)
        }
        {
            const {
                definition,
                bytesPerElement,
                name,
                id
            } = debug[2]
            expect(definition).toEqual({hair: "u16", health: "u16"})
            expect(bytesPerElement).toBe(4)
            expect(name).toBe("npcs")
            expect(id).toBe(2)
        }
    })

    it("should be able to retrieve correct number of component count", () => {
        const Ecs = defineEcs({
            components: {
                position: {x: "f64", y: "f64", z: "f64"},
                velocity: {x: "f64", y: "f64", z: "f64"},
                npcs: {hair: "u16", health: "u16"}
            }
        })
        const ecs = new Ecs()
        expect(ecs.debugger.componentCount).toBe(3)
    })
})