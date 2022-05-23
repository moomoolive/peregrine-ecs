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

describe("mutating component data", () => {
    it("can get reference to component data", () => {
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
        const ref = ecs.getComponent(e, ecs.components.position)!
        expect(typeof ref.x).toBe("number")
        expect(typeof ref.y).toBe("number")
        expect(typeof ref.z).toBe("number")
    })

    it("mutations are persistent", () => {
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
        const ref = ecs.getComponent(e, ecs.components.position)!
        ref.x = 1.0
        ref.y = 2.0
        ref.z = 3.0
        const {x, y, z} = ecs.getComponent(e, ecs.components.position)!
        expect(x).toBe(1.0)
        expect(y).toBe(2.0)
        expect(z).toBe(3.0)
    })

    it("mutations made on components persist even when components/tags are added to entity", () => {
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
        const ref = ecs.getComponent(e, ecs.components.position)!
        ref.x = 1.0
        ref.y = 2.0
        ref.z = 3.0
        ecs.addComponent(e, ecs.components.inventory)
        {
            const {x, y, z} = ecs.getComponent(e, ecs.components.position)!
            expect(x).toBe(1.0)
            expect(y).toBe(2.0)
            expect(z).toBe(3.0)
        }
        ecs.removeComponent(e, ecs.components.inventory)
        {
            const {x, y, z} = ecs.getComponent(e, ecs.components.position)!
            expect(x).toBe(1.0)
            expect(y).toBe(2.0)
            expect(z).toBe(3.0)
        }
    })

    it("cannot get component that doesn't exist on entity", () => {
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
        const ref = ecs.getComponent(e, ecs.components.position)
        expect(ref).toBe(null)
    })

    it("cannot get reference to a non-component", () => {
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
        const tag = ecs.newId()
        const ref = ecs.getComponent(e, tag)
        expect(ref).toBe(null)
    })

    it("cannot get a component reference to an inactive entity", () => {
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
        ecs.delete(e)
        expect(ecs.isActive(e)).toBe(false)
        const ref = ecs.getComponent(e, ecs.components.position)
        expect(ref).toBe(null)
    })
})