import {expect, it, describe} from "@jest/globals"
import {Ecs} from "./index"

describe("adding/removing tag components", () => {
    it("should be able to add tag component", () => {
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
        ecs.addTag(e, tag)
        expect(ecs.hasId(e, tag)).toBe(true)
        /* can delete entity with added tags normally */
        ecs.delete(e)
        expect(ecs.isAlive(e)).toBe(false)
    })
})