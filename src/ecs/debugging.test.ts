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
        expect(ecs.componentCount).toBe(4)
        const comps = ecs["~all_components_info"]()
        {
            const {
                name,
                bytesPerElement,
                stringifiedDef,
            } = comps.find(({name}) => name === "controller")!
            expect(name).toBe("controller")
            expect(bytesPerElement).toBe(8)
            const {controller} = ecs.declaredComponents
            expect(JSON.parse(stringifiedDef)).toEqual(controller)
        }
        {
            const {
                name,
                bytesPerElement,
                stringifiedDef,
            } = comps.find(({name}) => name === "playerType")!
            expect(name).toBe("playerType")
            expect(bytesPerElement).toBe(4)
            const {playerType} = ecs.declaredComponents
            expect(JSON.parse(stringifiedDef)).toEqual(playerType)
        }
    })

    it("should be able to debug component  through it's registry key", () => {
        const {components, declaredComponents} = ecs
        {
        const {
            name, 
            stringifiedDef
        } = ecs["~debug_component"](components.controller)
        expect(name).toBe("controller")
        expect(JSON.parse(stringifiedDef)).toEqual(
            declaredComponents.controller
        )
        }
        {
            const {
                name, 
                stringifiedDef
            } = ecs["~debug_component"](components.inventory)
            expect(name).toBe("inventory")
            expect(JSON.parse(stringifiedDef)).toEqual(
                declaredComponents.inventory
            )
        }
    })

    it("attempting to debug a non component with component debug should throw", () => {
        const nonComponent = ecs.newId()
        expect(() => ecs["~debug_component"](nonComponent)).toThrow()
    })
})