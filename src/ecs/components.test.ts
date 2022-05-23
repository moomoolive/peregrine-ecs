import {describe, it, expect} from "@jest/globals"
import {Ecs} from "./index"

describe("adding components", () => {
    it("should be able to add components", () => {
        const ecs = new Ecs({
            components: {
                position: {x: "f64", y: "f64", z: "f64"},
                controller: {up: "i32", down: "i32"},
                inventory: {weight: "i32", items: "i32"},
                playerType: {type: "i32"},
                time: {value: "f32"}
            }
        })
        const e = ecs.newId()
        ecs.addComponent(e, ecs.components.position)
        expect(ecs.hasComponent(e, ecs.components.position)).toBe(true)
        expect(ecs.isActive(e)).toBe(true)
    })

    it("can add multiple components", () => {
        const ecs = new Ecs({
            components: {
                position: {x: "f64", y: "f64", z: "f64"},
                controller: {up: "i32", down: "i32"},
                inventory: {weight: "i32", items: "i32"},
                playerType: {type: "i32"},
                time: {value: "f32"}
            }
        })
        const e = ecs.newId()
        ecs.addComponent(e, ecs.components.position)
        expect(ecs.hasComponent(e, ecs.components.position)).toBe(true)
        ecs.addComponent(e, ecs.components.controller)
        expect(ecs.hasComponent(e, ecs.components.controller)).toBe(true)
        ecs.addComponent(e, ecs.components.inventory)
        expect(ecs.hasComponent(e, ecs.components.inventory)).toBe(true)
    })

    it("cannot add non-components as components", () => {
        const ecs = new Ecs({
            components: {
                position: {x: "f64", y: "f64", z: "f64"},
                controller: {up: "i32", down: "i32"},
                inventory: {weight: "i32", items: "i32"},
                playerType: {type: "i32"},
                time: {value: "f32"}
            }
        })
        const e = ecs.newId()
        const status = ecs.addComponent(e, ecs.relations.instanceof)
        expect(status).toBeLessThan(0)
    })

    it("cannot add components to uninitialized entity", () => {
        const ecs = new Ecs({
            components: {
                position: {x: "f64", y: "f64", z: "f64"},
                controller: {up: "i32", down: "i32"},
                inventory: {weight: "i32", items: "i32"},
                playerType: {type: "i32"},
                time: {value: "f32"}
            }
        })
        const e = ecs.newId()
        ecs.delete(e)
        expect(ecs.isActive(e)).toBe(false)
        const status = ecs.addComponent(e, ecs.relations.instanceof)
        expect(status).toBeLessThan(0)
    })
})

describe("remove components", () => {
    it("should be able to add components", () => {
        const ecs = new Ecs({
            components: {
                position: {x: "f64", y: "f64", z: "f64"},
                controller: {up: "i32", down: "i32"},
                inventory: {weight: "i32", items: "i32"},
                playerType: {type: "i32"},
                time: {value: "f32"}
            }
        })
        const e = ecs.newId()
        ecs.addComponent(e, ecs.components.position)
        expect(ecs.hasComponent(e, ecs.components.position)).toBe(true)
        expect(ecs.isActive(e)).toBe(true)
        ecs.removeComponent(e, ecs.components.position)
        expect(ecs.hasComponent(e, ecs.components.position)).toBe(false)
        expect(ecs.isActive(e)).toBe(true)
    })

    it("can remove multiple components", () => {
        const ecs = new Ecs({
            components: {
                position: {x: "f64", y: "f64", z: "f64"},
                controller: {up: "i32", down: "i32"},
                inventory: {weight: "i32", items: "i32"},
                playerType: {type: "i32"},
                time: {value: "f32"}
            }
        })
        const e = ecs.newId()
        ecs.addComponent(e, ecs.components.position)
        ecs.addComponent(e, ecs.components.controller)
        ecs.addComponent(e, ecs.components.inventory)
        ecs.removeComponent(e, ecs.components.position)
        expect(ecs.hasComponent(e, ecs.components.position)).toBe(false)
        ecs.removeComponent(e, ecs.components.controller)
        expect(ecs.hasComponent(e, ecs.components.controller)).toBe(false)
        ecs.removeComponent(e, ecs.components.inventory)
        expect(ecs.hasComponent(e, ecs.components.inventory)).toBe(false)
        console.log(ecs["tables"].slice(2))
    })

    it("cannot remove non-components as components", () => {
        const ecs = new Ecs({
            components: {
                position: {x: "f64", y: "f64", z: "f64"},
                controller: {up: "i32", down: "i32"},
                inventory: {weight: "i32", items: "i32"},
                playerType: {type: "i32"},
                time: {value: "f32"}
            }
        })
        const e = ecs.newId()
        const status = ecs.removeComponent(e, ecs.relations.instanceof)
        expect(status).toBeLessThan(0)
    })

    it("cannot remove components from uninitialized entity", () => {
        const ecs = new Ecs({
            components: {
                position: {x: "f64", y: "f64", z: "f64"},
                controller: {up: "i32", down: "i32"},
                inventory: {weight: "i32", items: "i32"},
                playerType: {type: "i32"},
                time: {value: "f32"}
            }
        })
        const e = ecs.newId()
        ecs.delete(e)
        expect(ecs.isActive(e)).toBe(false)
        const status = ecs.removeComponent(e, ecs.relations.instanceof)
        expect(status).toBeLessThan(0)
    })
})