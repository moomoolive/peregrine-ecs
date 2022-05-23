import {describe, it, expect} from "@jest/globals"
import {Ecs} from "./index"
import {entity_mutation_status} from "../entities/mutations"

describe("adding relationships", () => {
    it("should be able to add relationship", () => {
        const ecs = new Ecs({
            components: {
                position: {x: "f64", y: "f64", z: "f64"},
                controller: {up: "i32", down: "i32"},
                inventory: {weight: "i32", items: "i32"},
                playerType: {type: "i32"},
                time: {value: "f32"}
            },
            relations: {
                eats: "immutable"
            }
        })
        expect(true).toBe(true)
        const e = ecs.newId()
        const apple = ecs.newId()
        ecs.addRelationship(e, ecs.relations.eats, apple)
        expect(ecs.hasRelationship(e, ecs.relations.eats, apple)).toBe(true)
    })

    it("can add multiple relationships", () => {
        const ecs = new Ecs({
            components: {
                position: {x: "f64", y: "f64", z: "f64"},
                controller: {up: "i32", down: "i32"},
                inventory: {weight: "i32", items: "i32"},
                playerType: {type: "i32"},
                time: {value: "f32"}
            },
            relations: {
                eats: "immutable"
            }
        })
        expect(true).toBe(true)
        const e = ecs.newId()
        const apple = ecs.newId()
        ecs.addRelationship(e, ecs.relations.eats, apple)
        expect(ecs.hasRelationship(e, ecs.relations.eats, apple)).toBe(true)
        const oranges = ecs.newId()
        ecs.addRelationship(e, ecs.relations.eats, oranges)
        expect(ecs.hasRelationship(e, ecs.relations.eats, oranges)).toBe(true)
    })

    it("adding the same relationship twice does nothing", () => {
        const ecs = new Ecs({
            components: {
                position: {x: "f64", y: "f64", z: "f64"},
                controller: {up: "i32", down: "i32"},
                inventory: {weight: "i32", items: "i32"},
                playerType: {type: "i32"},
                time: {value: "f32"}
            },
            relations: {
                eats: "immutable"
            }
        })
        expect(true).toBe(true)
        const e = ecs.newId()
        const apple = ecs.newId()
        ecs.addRelationship(e, ecs.relations.eats, apple)
        expect(ecs.hasRelationship(e, ecs.relations.eats, apple)).toBe(true)
        const status = ecs.addRelationship(e, ecs.relations.eats, apple)
        expect(status).toBe(entity_mutation_status.relationship_exists)
        expect(ecs.hasRelationship(e, ecs.relations.eats, apple)).toBe(true)
    })
})

describe("removing relationships", () => {
    it("should be able to remove relationship", () => {
        const ecs = new Ecs({
            components: {
                position: {x: "f64", y: "f64", z: "f64"},
                controller: {up: "i32", down: "i32"},
                inventory: {weight: "i32", items: "i32"},
                playerType: {type: "i32"},
                time: {value: "f32"}
            },
            relations: {
                eats: "immutable"
            }
        })
        expect(true).toBe(true)
        const e = ecs.newId()
        const apple = ecs.newId()
        ecs.addRelationship(e, ecs.relations.eats, apple)
        expect(ecs.hasRelationship(e, ecs.relations.eats, apple)).toBe(true)
        ecs.removeRelationship(e, ecs.relations.eats, apple)
        expect(ecs.hasRelationship(e, ecs.relations.eats, apple)).toBe(false)
    })

    it("can remove multiple relationships", () => {
        const ecs = new Ecs({
            components: {
                position: {x: "f64", y: "f64", z: "f64"},
                controller: {up: "i32", down: "i32"},
                inventory: {weight: "i32", items: "i32"},
                playerType: {type: "i32"},
                time: {value: "f32"}
            },
            relations: {
                eats: "immutable"
            }
        })
        expect(true).toBe(true)
        const e = ecs.newId()
        const apple = ecs.newId()
        ecs.addRelationship(e, ecs.relations.eats, apple)
        expect(ecs.hasRelationship(e, ecs.relations.eats, apple)).toBe(true)
        const oranges = ecs.newId()
        ecs.addRelationship(e, ecs.relations.eats, oranges)
        expect(ecs.hasRelationship(e, ecs.relations.eats, oranges)).toBe(true)
        ecs.removeRelationship(e, ecs.relations.eats, oranges)
        expect(ecs.hasRelationship(e, ecs.relations.eats, oranges)).toBe(false)
        ecs.removeRelationship(e, ecs.relations.eats, apple)
        expect(ecs.hasRelationship(e, ecs.relations.eats, apple)).toBe(false)
    })

    it("removing the same relationship twice does nothing", () => {
        const ecs = new Ecs({
            components: {
                position: {x: "f64", y: "f64", z: "f64"},
                controller: {up: "i32", down: "i32"},
                inventory: {weight: "i32", items: "i32"},
                playerType: {type: "i32"},
                time: {value: "f32"}
            },
            relations: {
                eats: "immutable"
            }
        })
        expect(true).toBe(true)
        const e = ecs.newId()
        const apple = ecs.newId()
        ecs.addRelationship(e, ecs.relations.eats, apple)
        expect(ecs.hasRelationship(e, ecs.relations.eats, apple)).toBe(true)
        ecs.removeRelationship(e, ecs.relations.eats, apple)
        const status = ecs.removeRelationship(e, ecs.relations.eats, apple)
        expect(status).toBe(entity_mutation_status.relationship_not_found)
        expect(ecs.hasRelationship(e, ecs.relations.eats, apple)).toBe(false)
    })
})