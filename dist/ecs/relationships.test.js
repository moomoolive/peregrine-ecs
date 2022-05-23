"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const index_1 = require("./index");
(0, globals_1.describe)("adding relationships", () => {
    (0, globals_1.it)("should be able to add relationship", () => {
        const ecs = new index_1.Ecs({
            components: {
                position: { x: "f64", y: "f64", z: "f64" },
                controller: { up: "i32", down: "i32" },
                inventory: { weight: "i32", items: "i32" },
                playerType: { type: "i32" },
                time: { value: "f32" }
            },
            relations: {
                eats: "immutable"
            }
        });
        (0, globals_1.expect)(true).toBe(true);
        const e = ecs.newId();
        const apple = ecs.newId();
        ecs.addRelationship(e, ecs.relations.eats, apple);
        (0, globals_1.expect)(ecs.hasRelationship(e, ecs.relations.eats, apple)).toBe(true);
    });
    (0, globals_1.it)("can add multiple relationships", () => {
        const ecs = new index_1.Ecs({
            components: {
                position: { x: "f64", y: "f64", z: "f64" },
                controller: { up: "i32", down: "i32" },
                inventory: { weight: "i32", items: "i32" },
                playerType: { type: "i32" },
                time: { value: "f32" }
            },
            relations: {
                eats: "immutable"
            }
        });
        (0, globals_1.expect)(true).toBe(true);
        const e = ecs.newId();
        const apple = ecs.newId();
        ecs.addRelationship(e, ecs.relations.eats, apple);
        (0, globals_1.expect)(ecs.hasRelationship(e, ecs.relations.eats, apple)).toBe(true);
        const oranges = ecs.newId();
        ecs.addRelationship(e, ecs.relations.eats, oranges);
        (0, globals_1.expect)(ecs.hasRelationship(e, ecs.relations.eats, oranges)).toBe(true);
    });
    (0, globals_1.it)("adding the same relationship twice does nothing", () => {
        const ecs = new index_1.Ecs({
            components: {
                position: { x: "f64", y: "f64", z: "f64" },
                controller: { up: "i32", down: "i32" },
                inventory: { weight: "i32", items: "i32" },
                playerType: { type: "i32" },
                time: { value: "f32" }
            },
            relations: {
                eats: "immutable"
            }
        });
        (0, globals_1.expect)(true).toBe(true);
        const e = ecs.newId();
        const apple = ecs.newId();
        ecs.addRelationship(e, ecs.relations.eats, apple);
        (0, globals_1.expect)(ecs.hasRelationship(e, ecs.relations.eats, apple)).toBe(true);
        const status = ecs.addRelationship(e, ecs.relations.eats, apple);
        (0, globals_1.expect)(status).toBe(1 /* relationship_exists */);
        (0, globals_1.expect)(ecs.hasRelationship(e, ecs.relations.eats, apple)).toBe(true);
    });
});
(0, globals_1.describe)("removing relationships", () => {
    (0, globals_1.it)("should be able to remove relationship", () => {
        const ecs = new index_1.Ecs({
            components: {
                position: { x: "f64", y: "f64", z: "f64" },
                controller: { up: "i32", down: "i32" },
                inventory: { weight: "i32", items: "i32" },
                playerType: { type: "i32" },
                time: { value: "f32" }
            },
            relations: {
                eats: "immutable"
            }
        });
        (0, globals_1.expect)(true).toBe(true);
        const e = ecs.newId();
        const apple = ecs.newId();
        ecs.addRelationship(e, ecs.relations.eats, apple);
        (0, globals_1.expect)(ecs.hasRelationship(e, ecs.relations.eats, apple)).toBe(true);
        ecs.removeRelationship(e, ecs.relations.eats, apple);
        (0, globals_1.expect)(ecs.hasRelationship(e, ecs.relations.eats, apple)).toBe(false);
    });
    (0, globals_1.it)("can remove multiple relationships", () => {
        const ecs = new index_1.Ecs({
            components: {
                position: { x: "f64", y: "f64", z: "f64" },
                controller: { up: "i32", down: "i32" },
                inventory: { weight: "i32", items: "i32" },
                playerType: { type: "i32" },
                time: { value: "f32" }
            },
            relations: {
                eats: "immutable"
            }
        });
        (0, globals_1.expect)(true).toBe(true);
        const e = ecs.newId();
        const apple = ecs.newId();
        ecs.addRelationship(e, ecs.relations.eats, apple);
        (0, globals_1.expect)(ecs.hasRelationship(e, ecs.relations.eats, apple)).toBe(true);
        const oranges = ecs.newId();
        ecs.addRelationship(e, ecs.relations.eats, oranges);
        (0, globals_1.expect)(ecs.hasRelationship(e, ecs.relations.eats, oranges)).toBe(true);
        ecs.removeRelationship(e, ecs.relations.eats, oranges);
        (0, globals_1.expect)(ecs.hasRelationship(e, ecs.relations.eats, oranges)).toBe(false);
        ecs.removeRelationship(e, ecs.relations.eats, apple);
        (0, globals_1.expect)(ecs.hasRelationship(e, ecs.relations.eats, apple)).toBe(false);
    });
    (0, globals_1.it)("removing the same relationship twice does nothing", () => {
        const ecs = new index_1.Ecs({
            components: {
                position: { x: "f64", y: "f64", z: "f64" },
                controller: { up: "i32", down: "i32" },
                inventory: { weight: "i32", items: "i32" },
                playerType: { type: "i32" },
                time: { value: "f32" }
            },
            relations: {
                eats: "immutable"
            }
        });
        (0, globals_1.expect)(true).toBe(true);
        const e = ecs.newId();
        const apple = ecs.newId();
        ecs.addRelationship(e, ecs.relations.eats, apple);
        (0, globals_1.expect)(ecs.hasRelationship(e, ecs.relations.eats, apple)).toBe(true);
        ecs.removeRelationship(e, ecs.relations.eats, apple);
        const status = ecs.removeRelationship(e, ecs.relations.eats, apple);
        (0, globals_1.expect)(status).toBe(3 /* relationship_not_found */);
        (0, globals_1.expect)(ecs.hasRelationship(e, ecs.relations.eats, apple)).toBe(false);
    });
});
