import {expect, it, describe} from "@jest/globals"
import {Ecs} from "./index"

describe("component debugging", () => {
    const ecs = new Ecs({
        components: {
            position: {x: "f64", y: "f64", z: "f64"},
            controller: {up: "i32", down: "i32"},
            inventory: {weight: "i32", items: "i32"},
            playerType: {type: "i32"}
        }
    })
    
    it("correct number of debug logs should be generated for inputted components", () => {
        expect(ecs.debug.componentCount).toBe(4)
        const comps = ecs.debug.allComponents()
        {
            const {
                id, name,
                bytesPerElement,
                stringifiedDef,
            } = comps[1]
            expect(name).toBe("controller")
            expect(bytesPerElement).toBe(8)
            const {controller} = ecs.debug.schemas
            expect(JSON.parse(stringifiedDef)).toEqual(controller)
            /* ordering of keys is different */
            expect(Object.keys(stringifiedDef)).not.toEqual(
                Object.keys(controller)
            )
        }
        {
            const {
                name,
                bytesPerElement,
                stringifiedDef,
            } = comps[3]
            expect(name).toBe("playerType")
            expect(bytesPerElement).toBe(4)
            const {playerType} = ecs.debug.schemas
            expect(JSON.parse(stringifiedDef)).toEqual(playerType)
        }
    })

    it("component schemas should be immutable", () => {
        // @ts-ignore
        expect(() => ecs.debug.schemas.controller = {}).toThrow()
    })
})