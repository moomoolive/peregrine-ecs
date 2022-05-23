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
(0, globals_1.describe)("remove components", () => {
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
        ecs.removeComponent(e, ecs.components.position);
        (0, globals_1.expect)(ecs.hasComponent(e, ecs.components.position)).toBe(false);
        (0, globals_1.expect)(ecs.isActive(e)).toBe(true);
    });
    (0, globals_1.it)("can remove multiple components", () => {
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
        ecs.addComponent(e, ecs.components.controller);
        ecs.addComponent(e, ecs.components.inventory);
        ecs.removeComponent(e, ecs.components.position);
        (0, globals_1.expect)(ecs.hasComponent(e, ecs.components.position)).toBe(false);
        ecs.removeComponent(e, ecs.components.controller);
        (0, globals_1.expect)(ecs.hasComponent(e, ecs.components.controller)).toBe(false);
        ecs.removeComponent(e, ecs.components.inventory);
        (0, globals_1.expect)(ecs.hasComponent(e, ecs.components.inventory)).toBe(false);
    });
    (0, globals_1.it)("cannot remove non-components as components", () => {
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
        const status = ecs.removeComponent(e, ecs.relations.instanceof);
        (0, globals_1.expect)(status).toBeLessThan(0);
    });
    (0, globals_1.it)("cannot remove components from uninitialized entity", () => {
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
        const status = ecs.removeComponent(e, ecs.relations.instanceof);
        (0, globals_1.expect)(status).toBeLessThan(0);
    });
});
(0, globals_1.describe)("mutating component data", () => {
    (0, globals_1.it)("can get reference to component data", () => {
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
        const ref = ecs.getComponent(e, ecs.components.position);
        (0, globals_1.expect)(typeof ref.x).toBe("number");
        (0, globals_1.expect)(typeof ref.y).toBe("number");
        (0, globals_1.expect)(typeof ref.z).toBe("number");
    });
    (0, globals_1.it)("mutations are persistent", () => {
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
        const ref = ecs.getComponent(e, ecs.components.position);
        ref.x = 1.0;
        ref.y = 2.0;
        ref.z = 3.0;
        const { x, y, z } = ecs.getComponent(e, ecs.components.position);
        (0, globals_1.expect)(x).toBe(1.0);
        (0, globals_1.expect)(y).toBe(2.0);
        (0, globals_1.expect)(z).toBe(3.0);
    });
    (0, globals_1.it)("mutations made on components persist even when components/tags are added to entity", () => {
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
        const ref = ecs.getComponent(e, ecs.components.position);
        ref.x = 1.0;
        ref.y = 2.0;
        ref.z = 3.0;
        ecs.addComponent(e, ecs.components.inventory);
        {
            const { x, y, z } = ecs.getComponent(e, ecs.components.position);
            (0, globals_1.expect)(x).toBe(1.0);
            (0, globals_1.expect)(y).toBe(2.0);
            (0, globals_1.expect)(z).toBe(3.0);
        }
        ecs.removeComponent(e, ecs.components.inventory);
        {
            const { x, y, z } = ecs.getComponent(e, ecs.components.position);
            (0, globals_1.expect)(x).toBe(1.0);
            (0, globals_1.expect)(y).toBe(2.0);
            (0, globals_1.expect)(z).toBe(3.0);
        }
    });
    (0, globals_1.it)("cannot get component that doesn't exist on entity", () => {
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
        const ref = ecs.getComponent(e, ecs.components.position);
        (0, globals_1.expect)(ref).toBe(null);
    });
    (0, globals_1.it)("cannot get reference to a non-component", () => {
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
        const ref = ecs.getComponent(e, tag);
        (0, globals_1.expect)(ref).toBe(null);
    });
    (0, globals_1.it)("cannot get a component reference to an inactive entity", () => {
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
        ecs.delete(e);
        (0, globals_1.expect)(ecs.isActive(e)).toBe(false);
        const ref = ecs.getComponent(e, ecs.components.position);
        (0, globals_1.expect)(ref).toBe(null);
    });
});
