import {expect, it, describe} from "@jest/globals"
import {Ecs} from "./index"
import {entity_mutation_status} from "../entities/mutations"

describe("adding tag components", () => {
    it("should be able to add tag component", () => {
        const ecs = new Ecs({
            components: {
                position: {x: "f64", y: "f64", z: "f64"},
                controller: {up: "i32", down: "i32"},
                inventory: {weight: "i32", items: "i32"},
                playerType: {type: "i32"},
                time: {value: "f32"}
            },
        })
        const e = ecs.newId()
        const tag = ecs.newId()
        const successStatus = ecs.addId(e, tag)
        expect(successStatus).toBeGreaterThanOrEqual(0)
        expect(ecs.hasId(e, tag)).toBe(true)
        // can delete entity with added tags normally
        ecs.delete(e)
        expect(ecs.isActive(e)).toBe(false)
    })

    it("can add multiple tags to entity", () => {
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
        const tag2 = ecs.newId()
        const tag3 = ecs.newId()
        ecs.addId(e, tag)
        ecs.addId(e, tag2)
        ecs.addId(e, tag3)
        expect(ecs.hasId(e, tag)).toBe(true)
        expect(ecs.hasId(e, tag2)).toBe(true)
        expect(ecs.hasId(e, tag3)).toBe(true)
    })

    it("should not be able to add tag to uninitalized component", () => {
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
        ecs.delete(e)
        const failStatus = ecs.addId(e, tag)
        expect(failStatus).toBeLessThan(0)
        expect(ecs.isActive(e)).toBe(false)
        expect(ecs.isActive(tag)).toBe(true)
    })

    it("adding the same tag to the same entity multiple times does nothing", () => {
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
        const status = ecs.addId(e, tag)
        const status2 = ecs.addId(e, tag)
        expect(status).toBeGreaterThanOrEqual(0)
        expect(status2).toBe(entity_mutation_status.tag_exists)
        expect(ecs.isActive(e)).toBe(true)
        expect(ecs.hasId(e, tag))
    })

    it("cannot add tags to immutable entities, (like components)", () => {
        const ecs = new Ecs({
            components: {
                position: {x: "f64", y: "f64", z: "f64"},
                controller: {up: "i32", down: "i32"},
                inventory: {weight: "i32", items: "i32"},
                playerType: {type: "i32"},
                time: {value: "f32"}
            },
            relations: {
                marriedTo: "immutable"
            },
            entities: {
                myNpc: "immutable"
            }
        })
        const tag = ecs.newId()
        const status = ecs.addId(ecs.components.controller as number, tag)
        expect(status).toBe(entity_mutation_status.entity_immutable)
        expect(ecs.hasId(ecs.components.controller as number, tag)).toBe(false)
        expect(ecs.addId(ecs.relations.marriedTo, tag)).toBe(
            entity_mutation_status.entity_immutable
        )
        expect(ecs.hasId(ecs.relations.marriedTo, tag)).toBe(false)
        expect(ecs.addId(ecs.entities.myNpc, tag)).toBe(
            entity_mutation_status.entity_immutable
        )
        expect(ecs.hasId(ecs.entities.myNpc, tag)).toBe(false)
    })

    it("can add tags to reserved entities", () => {
        const ecs = new Ecs({
            components: {
                position: {x: "f64", y: "f64", z: "f64"},
                controller: {up: "i32", down: "i32"},
                inventory: {weight: "i32", items: "i32"},
                playerType: {type: "i32"},
                time: {value: "f32"}
            },
            entities: {
                myNpc: "reserved"
            }
        })
        const tag = ecs.newId()
        expect(ecs.isActive(ecs.entities.myNpc)).toBe(true)
        ecs.addId(ecs.entities.myNpc, tag)
        expect(ecs.hasId(ecs.entities.myNpc, tag)).toBe(true)
    })
})

describe("removing tag components", () => {
    it("can remove tag components", () => {
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
        ecs.addId(e, tag)
        expect(ecs.hasId(e, tag)).toBe(true)
        const removeStatus = ecs.removeId(e, tag)
        expect(removeStatus).toBeGreaterThanOrEqual(0)
        expect(ecs.hasId(e, tag)).toBe(false)
        expect(ecs.isActive(e)).toBe(true)
    })

    it("attempting to remove a tag twice does nothing", () => {
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
        ecs.addId(e, tag)
        expect(ecs.hasId(e, tag)).toBe(true)
        const removeStatus = ecs.removeId(e, tag)
        expect(removeStatus).toBeGreaterThanOrEqual(0)
        expect(ecs.removeId(e, tag)).toBe(entity_mutation_status.tag_not_found)
        expect(ecs.isActive(e)).toBe(true)
    })

    it("should not be able delete id on uninitalized entity", () => {
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
        ecs.delete(e)
        expect(ecs.removeId(e, tag)).toBeLessThan(0)
    })

    it("can remove multiple tags from entity", () => {
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
        const tag2 = ecs.newId()
        const tag3 = ecs.newId()
        ecs.addId(e, tag)
        ecs.addId(e, tag2)
        ecs.addId(e, tag3)
        expect(ecs.hasId(e, tag)).toBe(true)
        expect(ecs.hasId(e, tag2)).toBe(true)
        expect(ecs.hasId(e, tag3)).toBe(true)
        ecs.removeId(e, tag)
        expect(ecs.hasId(e, tag)).toBe(false)
        ecs.removeId(e, tag3)
        expect(ecs.hasId(e, tag3)).toBe(false)
        ecs.removeId(e, tag2)
        expect(ecs.hasId(e, tag2)).toBe(false)
    })

    it("cannot remove tags from immutable entities, (like components)", () => {
        const ecs = new Ecs({
            components: {
                position: {x: "f64", y: "f64", z: "f64"},
                controller: {up: "i32", down: "i32"},
                inventory: {weight: "i32", items: "i32"},
                playerType: {type: "i32"},
                time: {value: "f32"}
            },
            relations: {
                marriedTo: "immutable"
            },
            entities: {
                myNpc: "immutable"
            }
        })
        const tag = ecs.newId()
        expect(ecs.removeId(ecs.components.controller as number, tag)).toBe(
            entity_mutation_status.entity_immutable
        )
        expect(ecs.removeId(ecs.relations.marriedTo, tag)).toBe(
            entity_mutation_status.entity_immutable
        )
        expect(ecs.removeId(ecs.entities.myNpc, tag)).toBe(
            entity_mutation_status.entity_immutable
        )
    })

    it("can remove tags from reserved entities", () => {
        const ecs = new Ecs({
            components: {
                position: {x: "f64", y: "f64", z: "f64"},
                controller: {up: "i32", down: "i32"},
                inventory: {weight: "i32", items: "i32"},
                playerType: {type: "i32"},
                time: {value: "f32"}
            },
            entities: {
                myNpc: "reserved"
            }
        })
        const tag = ecs.newId()
        expect(ecs.isActive(ecs.entities.myNpc)).toBe(true)
        ecs.addId(ecs.entities.myNpc, tag)
        expect(ecs.hasId(ecs.entities.myNpc, tag)).toBe(true)
        ecs.removeId(ecs.entities.myNpc, tag)
        expect(ecs.hasId(ecs.entities.myNpc, tag)).toBe(false)
        expect(ecs.isActive(ecs.entities.myNpc)).toBe(true)
    })
})