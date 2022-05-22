"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const index_1 = require("./index");
(0, globals_1.describe)("adding tag components", () => {
    (0, globals_1.it)("should be able to add tag component", () => {
        const ecs = new index_1.Ecs({
            components: {
                position: { x: "f64", y: "f64", z: "f64" },
                controller: { up: "i32", down: "i32" },
                inventory: { weight: "i32", items: "i32" },
                playerType: { type: "i32" },
                time: { value: "f32" }
            },
        });
        const e = ecs.newId();
        const tag = ecs.newId();
        const successStatus = ecs.addId(e, tag);
        (0, globals_1.expect)(successStatus).toBeGreaterThanOrEqual(0);
        (0, globals_1.expect)(ecs.hasId(e, tag)).toBe(true);
        // can delete entity with added tags normally
        ecs.delete(e);
        (0, globals_1.expect)(ecs.isAlive(e)).toBe(false);
    });
    (0, globals_1.it)("can add multiple tags to entity", () => {
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
        const tag2 = ecs.newId();
        const tag3 = ecs.newId();
        ecs.addId(e, tag);
        ecs.addId(e, tag2);
        ecs.addId(e, tag3);
        (0, globals_1.expect)(ecs.hasId(e, tag)).toBe(true);
        (0, globals_1.expect)(ecs.hasId(e, tag2)).toBe(true);
        (0, globals_1.expect)(ecs.hasId(e, tag3)).toBe(true);
    });
    (0, globals_1.it)("should not be able to add tag to uninitalized component", () => {
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
        ecs.delete(e);
        const failStatus = ecs.addId(e, tag);
        (0, globals_1.expect)(failStatus).toBeLessThan(0);
        (0, globals_1.expect)(ecs.isAlive(e)).toBe(false);
        (0, globals_1.expect)(ecs.isAlive(tag)).toBe(true);
    });
    (0, globals_1.it)("adding the same tag to the same entity multiple times does nothing", () => {
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
        const status = ecs.addId(e, tag);
        const status2 = ecs.addId(e, tag);
        (0, globals_1.expect)(status).toBeGreaterThanOrEqual(0);
        (0, globals_1.expect)(status2).toBe(1 /* tag_exists */);
        (0, globals_1.expect)(ecs.isAlive(e)).toBe(true);
        (0, globals_1.expect)(ecs.hasId(e, tag));
    });
    (0, globals_1.it)("cannot add tags to immutable entities, (like components)", () => {
        const ecs = new index_1.Ecs({
            components: {
                position: { x: "f64", y: "f64", z: "f64" },
                controller: { up: "i32", down: "i32" },
                inventory: { weight: "i32", items: "i32" },
                playerType: { type: "i32" },
                time: { value: "f32" }
            },
            relations: {
                marriedTo: "immutable"
            },
            entities: {
                myNpc: "immutable"
            }
        });
        const tag = ecs.newId();
        const status = ecs.addId(ecs.components.controller, tag);
        (0, globals_1.expect)(status).toBe(-2 /* entity_immutable */);
        (0, globals_1.expect)(ecs.hasId(ecs.components.controller, tag)).toBe(false);
        (0, globals_1.expect)(ecs.addId(ecs.relations.marriedTo, tag)).toBe(-2 /* entity_immutable */);
        (0, globals_1.expect)(ecs.hasId(ecs.relations.marriedTo, tag)).toBe(false);
        (0, globals_1.expect)(ecs.addId(ecs.entities.myNpc, tag)).toBe(-2 /* entity_immutable */);
        (0, globals_1.expect)(ecs.hasId(ecs.entities.myNpc, tag)).toBe(false);
    });
    (0, globals_1.it)("can add tags to reserved entities", () => {
        const ecs = new index_1.Ecs({
            components: {
                position: { x: "f64", y: "f64", z: "f64" },
                controller: { up: "i32", down: "i32" },
                inventory: { weight: "i32", items: "i32" },
                playerType: { type: "i32" },
                time: { value: "f32" }
            },
            entities: {
                myNpc: "reserved"
            }
        });
        const tag = ecs.newId();
        (0, globals_1.expect)(ecs.isAlive(ecs.entities.myNpc)).toBe(true);
        ecs.addId(ecs.entities.myNpc, tag);
        (0, globals_1.expect)(ecs.hasId(ecs.entities.myNpc, tag)).toBe(true);
    });
});
(0, globals_1.describe)("removing tag components", () => {
    (0, globals_1.it)("can remove tag components", () => {
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
        ecs.addId(e, tag);
        (0, globals_1.expect)(ecs.hasId(e, tag)).toBe(true);
        const removeStatus = ecs.removeId(e, tag);
        (0, globals_1.expect)(removeStatus).toBeGreaterThanOrEqual(0);
        (0, globals_1.expect)(ecs.hasId(e, tag)).toBe(false);
        (0, globals_1.expect)(ecs.isAlive(e)).toBe(true);
    });
    (0, globals_1.it)("attempting to remove a tag twice does nothing", () => {
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
        ecs.addId(e, tag);
        (0, globals_1.expect)(ecs.hasId(e, tag)).toBe(true);
        const removeStatus = ecs.removeId(e, tag);
        (0, globals_1.expect)(removeStatus).toBeGreaterThanOrEqual(0);
        (0, globals_1.expect)(ecs.removeId(e, tag)).toBe(3 /* tag_not_found */);
        (0, globals_1.expect)(ecs.isAlive(e)).toBe(true);
    });
    (0, globals_1.it)("should not be able delete id on uninitalized entity", () => {
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
        ecs.delete(e);
        (0, globals_1.expect)(ecs.removeId(e, tag)).toBeLessThan(0);
    });
    (0, globals_1.it)("can remove multiple tags from entity", () => {
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
        const tag2 = ecs.newId();
        const tag3 = ecs.newId();
        ecs.addId(e, tag);
        ecs.addId(e, tag2);
        ecs.addId(e, tag3);
        (0, globals_1.expect)(ecs.hasId(e, tag)).toBe(true);
        (0, globals_1.expect)(ecs.hasId(e, tag2)).toBe(true);
        (0, globals_1.expect)(ecs.hasId(e, tag3)).toBe(true);
        ecs.removeId(e, tag);
        (0, globals_1.expect)(ecs.hasId(e, tag)).toBe(false);
        ecs.removeId(e, tag3);
        (0, globals_1.expect)(ecs.hasId(e, tag3)).toBe(false);
        ecs.removeId(e, tag2);
        (0, globals_1.expect)(ecs.hasId(e, tag2)).toBe(false);
    });
    (0, globals_1.it)("cannot remove tags from immutable entities, (like components)", () => {
        const ecs = new index_1.Ecs({
            components: {
                position: { x: "f64", y: "f64", z: "f64" },
                controller: { up: "i32", down: "i32" },
                inventory: { weight: "i32", items: "i32" },
                playerType: { type: "i32" },
                time: { value: "f32" }
            },
            relations: {
                marriedTo: "immutable"
            },
            entities: {
                myNpc: "immutable"
            }
        });
        const tag = ecs.newId();
        (0, globals_1.expect)(ecs.removeId(ecs.components.controller, tag)).toBe(-2 /* entity_immutable */);
        (0, globals_1.expect)(ecs.removeId(ecs.relations.marriedTo, tag)).toBe(-2 /* entity_immutable */);
        (0, globals_1.expect)(ecs.removeId(ecs.entities.myNpc, tag)).toBe(-2 /* entity_immutable */);
    });
    (0, globals_1.it)("can remove tags from reserved entities", () => {
        const ecs = new index_1.Ecs({
            components: {
                position: { x: "f64", y: "f64", z: "f64" },
                controller: { up: "i32", down: "i32" },
                inventory: { weight: "i32", items: "i32" },
                playerType: { type: "i32" },
                time: { value: "f32" }
            },
            entities: {
                myNpc: "reserved"
            }
        });
        const tag = ecs.newId();
        (0, globals_1.expect)(ecs.isAlive(ecs.entities.myNpc)).toBe(true);
        ecs.addId(ecs.entities.myNpc, tag);
        (0, globals_1.expect)(ecs.hasId(ecs.entities.myNpc, tag)).toBe(true);
        ecs.removeId(ecs.entities.myNpc, tag);
        (0, globals_1.expect)(ecs.hasId(ecs.entities.myNpc, tag)).toBe(false);
        (0, globals_1.expect)(ecs.isAlive(ecs.entities.myNpc)).toBe(true);
    });
});
