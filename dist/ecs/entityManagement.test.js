"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const index_1 = require("./index");
const ids_1 = require("../entities/ids");
(0, globals_1.describe)("adding entity updates ecs stats", () => {
    (0, globals_1.it)("entity count is updated when ecs adds entity", () => {
        const ecs = new index_1.Ecs({
            components: {
                position: { x: "f64", y: "f64", z: "f64" },
                controller: { up: "i32", down: "i32" },
                inventory: { weight: "i32", items: "i32" },
                playerType: { type: "i32" },
                time: { value: "f32" }
            }
        });
        (0, globals_1.expect)(ecs.entityCount).toBe(0);
        ecs.newId();
        (0, globals_1.expect)(ecs.entityCount).toBe(1);
    });
    (0, globals_1.it)("precise entity count should always be higher than normal entity count", () => {
        const ecs = new index_1.Ecs({
            components: {
                position: { x: "f64", y: "f64", z: "f64" },
                controller: { up: "i32", down: "i32" },
                inventory: { weight: "i32", items: "i32" },
                playerType: { type: "i32" },
                time: { value: "f32" }
            }
        });
        (0, globals_1.expect)(ecs.entityCount).toBeLessThan(ecs.preciseEntityCount);
        ecs.newId();
        (0, globals_1.expect)(ecs.entityCount).toBeLessThan(ecs.preciseEntityCount);
        ecs.newId();
        ecs.newId();
        ecs.newId();
        (0, globals_1.expect)(ecs.entityCount).toBeLessThan(ecs.preciseEntityCount);
    });
});
(0, globals_1.describe)("entity creation", () => {
    (0, globals_1.it)("all created entities have the 'ecs_id' component and are alive", () => {
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
        (0, globals_1.expect)(ecs.hasId(e, 0 /* ecs_id */)).toBe(true);
        (0, globals_1.expect)(ecs.isAlive(e)).toBe(true);
    });
    (0, globals_1.it)("entity should be able to be deleted", () => {
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
        (0, globals_1.expect)(ecs.isAlive(e)).toBe(true);
        const status = ecs.delete(e);
        (0, globals_1.expect)(status).toBe(true);
        (0, globals_1.expect)(ecs.isAlive(e)).toBe(false);
        const e2 = ecs.newId();
        const e3 = ecs.newId();
        const e4 = ecs.newId();
        (0, globals_1.expect)(ecs.delete(e2)).toBe(true);
        (0, globals_1.expect)(ecs.isAlive(e2)).toBe(false);
        (0, globals_1.expect)(ecs.delete(e3)).toBe(true);
        (0, globals_1.expect)(ecs.isAlive(e3)).toBe(false);
        (0, globals_1.expect)(ecs.delete(e4)).toBe(true);
        (0, globals_1.expect)(ecs.isAlive(e4)).toBe(false);
    });
});
(0, globals_1.describe)("ecs id management", () => {
    (0, globals_1.it)("although ids are recycled, they should not be valid (for 63 generations) once deleted", () => {
        const ecs = new index_1.Ecs({
            components: {
                position: { x: "f64", y: "f64", z: "f64" },
                controller: { up: "i32", down: "i32" },
                inventory: { weight: "i32", items: "i32" },
                playerType: { type: "i32" },
                time: { value: "f32" }
            }
        });
        console.log(ecs["tables"][2]);
        console.log(ecs["tables"][1]);
        console.log(ecs["tables"][0]);
        const oldId = ecs.newId();
        ecs.delete(oldId);
        const newId = ecs.newId();
        /* same base id */
        (0, globals_1.expect)((0, ids_1.extractBaseId)(oldId)).toBe((0, ids_1.extractBaseId)(newId));
        /* but they are not equal */
        (0, globals_1.expect)(newId).not.toBe(oldId);
        /* deleted id fails check */
        (0, globals_1.expect)(ecs.isAlive(oldId)).toBe(false);
        (0, globals_1.expect)(ecs.isAlive(newId)).toBe(true);
    });
});
