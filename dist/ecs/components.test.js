"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const index_1 = require("./index");
(0, globals_1.describe)("adding components", () => {
    (0, globals_1.it)("should be able to add components", () => {
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
        ecs.addComponent(e, ecs.components.position);
        (0, globals_1.expect)(ecs.hasComponent(e, ecs.components.position)).toBe(true);
        (0, globals_1.expect)(ecs.isActive(e)).toBe(true);
    });
    (0, globals_1.it)("can add multiple components", () => {
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
        ecs.addComponent(e, ecs.components.position);
        (0, globals_1.expect)(ecs.hasComponent(e, ecs.components.position)).toBe(true);
        ecs.addComponent(e, ecs.components.controller);
        (0, globals_1.expect)(ecs.hasComponent(e, ecs.components.controller)).toBe(true);
        ecs.addComponent(e, ecs.components.inventory);
        (0, globals_1.expect)(ecs.hasComponent(e, ecs.components.inventory)).toBe(true);
    });
    (0, globals_1.it)("cannot add non-components as components", () => {
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
        const status = ecs.addComponent(e, ecs.relations.instanceof);
        (0, globals_1.expect)(status).toBeLessThan(0);
    });
    (0, globals_1.it)("cannot add components to uninitialized entity", () => {
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
        ecs.delete(e);
        (0, globals_1.expect)(ecs.isActive(e)).toBe(false);
        const status = ecs.addComponent(e, ecs.relations.instanceof);
        (0, globals_1.expect)(status).toBeLessThan(0);
    });
});
