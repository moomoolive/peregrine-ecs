"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const index_1 = require("./index");
(0, globals_1.describe)("adding/removing tag components", () => {
    (0, globals_1.it)("should be able to add tag component", () => {
        const ecs = new index_1.Ecs({
            components: {
                position: { x: "f64", y: "f64", z: "f64" },
                controller: { up: "i32", down: "i32" },
                inventory: { weight: "i32", items: "i32" },
                playerType: { type: "i32" },
                time: { value: "f32" }
            }
        });
        const e = ecs.newId();
        const tag = ecs.newId();
        ecs.addTag(e, tag);
        (0, globals_1.expect)(ecs.hasId(e, tag)).toBe(true);
        /* can delete entity with added tags normally */
        ecs.delete(e);
        (0, globals_1.expect)(ecs.isAlive(e)).toBe(false);
    });
});
