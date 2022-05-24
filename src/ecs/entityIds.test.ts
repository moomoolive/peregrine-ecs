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
        expect(ecs["~entity_count"]).toBe(0)
        ecs.newId()
        expect(ecs["~entity_count"]).toBe(1)
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
        expect(ecs["~entity_count"]).toBeLessThan(ecs["~preciseEntityCount"])
        ecs.newId()
        expect(ecs["~entity_count"]).toBeLessThan(ecs["~preciseEntityCount"])
        ecs.newId()
        ecs.newId()
        ecs.newId()
        expect(ecs["~entity_count"]).toBeLessThan(ecs["~preciseEntityCount"])
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
        expect(ecs.isActive(e)).toBe(true)
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
        expect(ecs.isActive(e)).toBe(true)
        const status = ecs.delete(e)
        expect(status).toBeGreaterThanOrEqual(0)
        expect(ecs.isActive(e)).toBe(false)
        
        const e2 = ecs.newId()
        const e3 = ecs.newId()
        const e4 = ecs.newId()

        expect(ecs.delete(e2)).toBeGreaterThanOrEqual(0)
        expect(ecs.isActive(e2)).toBe(false)

        expect(ecs.delete(e3)).toBeGreaterThanOrEqual(0)
        expect(ecs.isActive(e3)).toBe(false)

        expect(ecs.delete(e4)).toBeGreaterThanOrEqual(0)
        expect(ecs.isActive(e4)).toBe(false)
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
        expect(ecs.isActive(oldId)).toBe(false)
        expect(ecs.isActive(newId)).toBe(true)
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

    it("declared immutable relations/entities cannot be deleted", () => {
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
            },
            entities: {
                apples: "immutable"
            }
        })
        expect(ecs.delete(ecs.relations.eats)).toBe(entity_mutation_status.entity_immutable)
        expect(ecs.delete(ecs.entities.apples)).toBe(entity_mutation_status.entity_immutable)
    })
})

describe("reserved entities", () => {
    it("reserved entities are pre-initialized", () => {
        const ecs = new Ecs({
            components: {
                position: {x: "f64", y: "f64", z: "f64"},
                controller: {up: "i32", down: "i32"},
                inventory: {weight: "i32", items: "i32"},
                playerType: {type: "i32"},
                time: {value: "f32"}
            },
            relations: {
                eats: "reserved"
            },
            entities: {
                apples: "reserved"
            }
        })
        expect(ecs.isActive(ecs.relations.eats)).toBe(true)
        expect(ecs.isActive(ecs.entities.apples)).toBe(true)
    })

    it("reserved entities can be deleted", () => {
        const ecs = new Ecs({
            components: {
                position: {x: "f64", y: "f64", z: "f64"},
                controller: {up: "i32", down: "i32"},
                inventory: {weight: "i32", items: "i32"},
                playerType: {type: "i32"},
                time: {value: "f32"}
            },
            relations: {
                eats: "reserved"
            },
            entities: {
                apples: "reserved"
            }
        })
        expect(ecs.isActive(ecs.relations.eats)).toBe(true)
        expect(ecs.isActive(ecs.entities.apples)).toBe(true)
        ecs.delete(ecs.relations.eats)
        expect(ecs.isActive(ecs.relations.eats)).toBe(false)
        ecs.delete(ecs.entities.apples)
        expect(ecs.isActive(ecs.entities.apples)).toBe(false)
    })
})

describe("relations", () => {
    it("can created relations", () => {
        const ecs = new Ecs({
            components: {
                position: {x: "f64", y: "f64", z: "f64"},
                controller: {up: "i32", down: "i32"},
                inventory: {weight: "i32", items: "i32"},
                playerType: {type: "i32"},
                time: {value: "f32"}
            }
        })
        const relation = ecs.newRelation()
        expect(ecs.isActive(relation)).toBe(true)
    })

    it("relations can be deleted", () => {
        const ecs = new Ecs({
            components: {
                position: {x: "f64", y: "f64", z: "f64"},
                controller: {up: "i32", down: "i32"},
                inventory: {weight: "i32", items: "i32"},
                playerType: {type: "i32"},
                time: {value: "f32"}
            }
        })
        const relation = ecs.newRelation()
        expect(ecs.isActive(relation)).toBe(true)
        ecs.deleteRelation(relation)
        expect(ecs.isActive(relation)).toBe(false)
    })
})
