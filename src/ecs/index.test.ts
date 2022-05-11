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
        expect(JSON.parse(ecs.debugger.stringifiedComponentDeclaration)).toEqual(
            {
                position: {x: "f64", y: "f64", z: "f64"},
                velocity: {x: "f64", y: "f64", z: "f64"},
                npcs: {hair: "u16", health: "u16"}
            }
        )
        {
            const {
                definition,
                bytesPerElement,
                name,
                id,
                stringifiedDef
            } = ecs.debugger.componentInfo(ecs.components.position)
            expect(definition).toEqual([
                {name: "x", type: "f64", ptrOffset: 0},
                {name: "y", type: "f64", ptrOffset: 1},
                {name: "z", type: "f64", ptrOffset: 2},
                {name: "$component_segments_ptr", type: "i32", ptrOffset: 3}
            ])
            expect(JSON.parse(stringifiedDef)).toEqual({x: "f64", y: "f64", z: "f64"})
            expect(bytesPerElement).toBe(24)
            expect(name).toBe("position")
            expect(id).toBe(0)
        }
        {
            const {
                definition,
                bytesPerElement,
                name,
                id,
                stringifiedDef
            } = ecs.debugger.componentInfo(ecs.components.velocity)
            expect(definition).toEqual([
                {name: "x", type: "f64", ptrOffset: 0},
                {name: "y", type: "f64", ptrOffset: 1},
                {name: "z", type: "f64", ptrOffset: 2},
                {name: "$component_segments_ptr", type: "i32", ptrOffset: 3}
            ])
            expect(JSON.parse(stringifiedDef)).toEqual({x: "f64", y: "f64", z: "f64"})
            expect(bytesPerElement).toBe(24)
            expect(name).toBe("velocity")
            expect(id).toBe(1)
        }
        {
            const {
                definition,
                bytesPerElement,
                name,
                id,
                stringifiedDef
            } = ecs.debugger.componentInfo(ecs.components.npcs)
            expect(definition).toEqual([
                {name: "hair", type: "u16", ptrOffset: 0},
                {name: "health", type: "u16", ptrOffset: 1},
                {name: "$component_segments_ptr", type: "i32", ptrOffset: 2}
            ])
            expect(JSON.parse(stringifiedDef)).toEqual({hair: "u16", health: "u16"})
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
                id,
                stringifiedDef
            } = debug[0]
            expect(definition).toEqual([
                {name: "x", type: "f64", ptrOffset: 0},
                {name: "y", type: "f64", ptrOffset: 1},
                {name: "z", type: "f64", ptrOffset: 2},
                {name: "$component_segments_ptr", type: "i32", ptrOffset: 3}
            ])
            expect(JSON.parse(stringifiedDef)).toEqual({x: "f64", y: "f64", z: "f64"})
            expect(bytesPerElement).toBe(24)
            expect(name).toBe("position")
            expect(id).toBe(0)
        }
        {
            const {
                definition,
                bytesPerElement,
                name,
                id,
                stringifiedDef
            } = debug[1]
            expect(definition).toEqual([
                {name: "x", type: "f64", ptrOffset: 0},
                {name: "y", type: "f64", ptrOffset: 1},
                {name: "z", type: "f64", ptrOffset: 2},
                {name: "$component_segments_ptr", type: "i32", ptrOffset: 3}
            ])
            expect(JSON.parse(stringifiedDef)).toEqual({x: "f64", y: "f64", z: "f64"})
            expect(bytesPerElement).toBe(24)
            expect(name).toBe("velocity")
            expect(id).toBe(1)
        }
        {
            const {
                definition,
                bytesPerElement,
                name,
                id,
                stringifiedDef
            } = debug[2]
            expect(definition).toEqual([
                {name: "hair", type: "u16", ptrOffset: 0},
                {name: "health", type: "u16", ptrOffset: 1},
                {name: "$component_segments_ptr", type: "i32", ptrOffset: 2}
            ])
            expect(JSON.parse(stringifiedDef)).toEqual({hair: "u16", health: "u16"})
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