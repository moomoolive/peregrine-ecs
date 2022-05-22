import {expect, it, describe} from "@jest/globals"
import {Ecs} from "./index"
import {standard_entity} from "../entities/index"
import {stripIdMeta} from "../entities/ids"
import {entity_mutation_status} from "../entities/mutations"

describe("adding entity updates ecs stats", () => {
    it("entity count is updated when ecs adds entity", () => {
        const ecs = new Ecs({
            components: {
                position: {x: "f64", y: "f64", z: "f64"},
                controller: {up: "i32", down: "i32"},
                inventory: {weight: "i32", items: "i32"},
                playerType: {type: "i32"},
                time: {value: "f32"}
            }
        })
        expect(ecs.entityCount).toBe(0)
        ecs.newId()
        expect(ecs.entityCount).toBe(1)
    })

    it("precise entity count should always be higher than normal entity count", () => {
        const ecs = new Ecs({
            components: {
                position: {x: "f64", y: "f64", z: "f64"},
                controller: {up: "i32", down: "i32"},
                inventory: {weight: "i32", items: "i32"},
                playerType: {type: "i32"},
                time: {value: "f32"}
            }
        })

        expect(ecs.entityCount).toBeLessThan(ecs["~preciseEntityCount"])
        ecs.newId()
        expect(ecs.entityCount).toBeLessThan(ecs["~preciseEntityCount"])
        ecs.newId()
        ecs.newId()
        ecs.newId()
        expect(ecs.entityCount).toBeLessThan(ecs["~preciseEntityCount"])
    })
})

describe("entity creation", () => {
    it("all created entities have the 'ecs_id' component and are alive", () => {
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
        expect(ecs.hasId(e, standard_entity.ecs_id)).toBe(true)
        expect(ecs.isAlive(e)).toBe(true)
    })

    it("entity should be able to be deleted", () => {
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
        expect(ecs.isAlive(e)).toBe(true)
        const status = ecs.delete(e)
        expect(status).toBeGreaterThanOrEqual(0)
        expect(ecs.isAlive(e)).toBe(false)
        
        const e2 = ecs.newId()
        const e3 = ecs.newId()
        const e4 = ecs.newId()

        expect(ecs.delete(e2)).toBeGreaterThanOrEqual(0)
        expect(ecs.isAlive(e2)).toBe(false)

        expect(ecs.delete(e3)).toBeGreaterThanOrEqual(0)
        expect(ecs.isAlive(e3)).toBe(false)

        expect(ecs.delete(e4)).toBeGreaterThanOrEqual(0)
        expect(ecs.isAlive(e4)).toBe(false)
    })
})

describe("ecs id management", () => {
    it("although ids are recycled, they should not be valid (for 63 generations) once deleted", () => {
        const ecs = new Ecs({
            components: {
                position: {x: "f64", y: "f64", z: "f64"},
                controller: {up: "i32", down: "i32"},
                inventory: {weight: "i32", items: "i32"},
                playerType: {type: "i32"},
                time: {value: "f32"}
            }
        })
        const oldId = ecs.newId()
        ecs.delete(oldId)
        const newId = ecs.newId()
        /* same base id */
        expect(stripIdMeta(oldId)).toBe(stripIdMeta(newId))
        /* but they are not equal */
        expect(newId).not.toBe(oldId)
        /* deleted id fails check */
        expect(ecs.isAlive(oldId)).toBe(false)
        expect(ecs.isAlive(newId)).toBe(true)
    })
})

describe("immutable entities", () => {
    it("component entities cannot be deleted", () => {
        const ecs = new Ecs({
            components: {
                position: {x: "f64", y: "f64", z: "f64"},
                controller: {up: "i32", down: "i32"},
                inventory: {weight: "i32", items: "i32"},
                playerType: {type: "i32"},
                time: {value: "f32"}
            }
        })
        expect(ecs.delete(ecs.components.position as number)).toBe(entity_mutation_status.entity_immutable)
        expect(ecs.delete(ecs.components.inventory as number)).toBe(entity_mutation_status.entity_immutable)
    })

    it("declared relations cannot be deleted", () => {
        const ecs = new Ecs({
            components: {
                position: {x: "f64", y: "f64", z: "f64"},
                controller: {up: "i32", down: "i32"},
                inventory: {weight: "i32", items: "i32"},
                playerType: {type: "i32"},
                time: {value: "f32"}
            }
        })
        expect(ecs.delete(ecs.relations.instanceof)).toBe(entity_mutation_status.entity_immutable)
    })
})