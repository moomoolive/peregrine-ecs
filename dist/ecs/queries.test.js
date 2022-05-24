"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const index_1 = require("./index");
(0, globals_1.describe)("component queries", () => {
    (0, globals_1.it)("querying for component that no entity has returns no results", () => {
        const ecs = new index_1.Ecs({
            components: {
                position: { x: "f64", y: "f64", z: "f64" },
                controller: { up: "i32", down: "i32" },
                inventory: { weight: "i32", items: "i32" },
                playerType: { type: "i32" },
                time: { value: "f32" }
            }
        });
        const e1 = ecs.newId();
        ecs.addComponent(e1, ecs.components.position);
        const e2 = ecs.newId();
        ecs.addComponent(e2, ecs.components.position);
        const query = ecs.query()
            .component(ecs.components.inventory);
        let iter = 0;
        for (const _ of query.iter()) {
            iter++;
        }
        (0, globals_1.expect)(iter).toBe(0);
    });
    (0, globals_1.it)("can querying for component that some entities has returns results", () => {
        const ecs = new index_1.Ecs({
            components: {
                position: { x: "f64", y: "f64", z: "f64" },
                controller: { up: "i32", down: "i32" },
                inventory: { weight: "i32", items: "i32" },
                playerType: { type: "i32" },
                time: { value: "f32" }
            }
        });
        const e1 = ecs.newId();
        ecs.addComponent(e1, ecs.components.position);
        const e2 = ecs.newId();
        ecs.addComponent(e2, ecs.components.position);
        const query = ecs.query()
            .component(ecs.components.position);
        let iter = 0;
        let entities = 0;
        const targetEntities = [
            { id: e1, found: false },
            { id: e2, found: false },
        ];
        for (const { table, start, end } of query.iter()) {
            const positions = table.get(ecs.components.position);
            (0, globals_1.expect)(positions).not.toBe(null);
            targetEntities[0].found = table.entities.find(id => {
                return id === targetEntities[0].id;
            }) !== undefined;
            targetEntities[1].found = table.entities.find(id => {
                return id === targetEntities[1].id;
            }) !== undefined;
            for (let i = start; i < end; i++) {
                const p = positions.index(i);
                (0, globals_1.expect)(typeof p.x).toBe("number");
                (0, globals_1.expect)(typeof p.y).toBe("number");
                (0, globals_1.expect)(typeof p.z).toBe("number");
                entities++;
            }
            iter++;
        }
        (0, globals_1.expect)(targetEntities).toEqual([
            { id: e1, found: true },
            { id: e2, found: true },
        ]);
        (0, globals_1.expect)(iter).toBeGreaterThan(0);
        (0, globals_1.expect)(entities).toBe(2);
    });
    (0, globals_1.it)("can querying for component that some entities has returns results (multiple component)", () => {
        const ecs = new index_1.Ecs({
            components: {
                position: { x: "f64", y: "f64", z: "f64" },
                controller: { up: "i32", down: "i32" },
                inventory: { weight: "i32", items: "i32" },
                playerType: { type: "i32" },
                time: { value: "f32" }
            }
        });
        const { components: c } = ecs;
        const e1 = ecs.newId();
        ecs.addComponent(e1, c.position);
        ecs.addComponent(e1, c.controller);
        const e2 = ecs.newId();
        ecs.addComponent(e2, c.position);
        ecs.addComponent(e2, c.controller);
        const query = ecs.query()
            .component(c.position)
            .component(c.controller);
        let iter = 0;
        let entities = 0;
        const targetEntities = [
            { id: e1, found: false },
            { id: e2, found: false },
        ];
        for (const { table, start, end } of query.iter()) {
            const positions = table.get(c.position);
            const controllers = table.get(c.controller);
            (0, globals_1.expect)(positions).not.toBe(null);
            (0, globals_1.expect)(controllers).not.toBe(null);
            targetEntities[0].found = table.entities.find(id => {
                return id === targetEntities[0].id;
            }) !== undefined;
            targetEntities[1].found = table.entities.find(id => {
                return id === targetEntities[1].id;
            }) !== undefined;
            for (let i = start; i < end; i++) {
                const p = positions.index(i);
                (0, globals_1.expect)(typeof p.x).toBe("number");
                (0, globals_1.expect)(typeof p.y).toBe("number");
                (0, globals_1.expect)(typeof p.z).toBe("number");
                const control = controllers.index(i);
                (0, globals_1.expect)(typeof control.down).toBe("number");
                (0, globals_1.expect)(typeof control.up).toBe("number");
                entities++;
            }
            iter++;
        }
        (0, globals_1.expect)(targetEntities).toEqual([
            { id: e1, found: true },
            { id: e2, found: true },
        ]);
        (0, globals_1.expect)(iter).toBeGreaterThan(0);
        (0, globals_1.expect)(entities).toBe(2);
    });
});
(0, globals_1.describe)("tag queries", () => {
    (0, globals_1.it)("querying for tag that no entity has returns no results", () => {
        const ecs = new index_1.Ecs({
            components: {
                position: { x: "f64", y: "f64", z: "f64" },
                controller: { up: "i32", down: "i32" },
                inventory: { weight: "i32", items: "i32" },
                playerType: { type: "i32" },
                time: { value: "f32" }
            }
        });
        const e1 = ecs.newId();
        const e2 = ecs.newId();
        const tag = ecs.newId();
        ecs.addId(e1, tag);
        ecs.addId(e2, tag);
        const randomTag = ecs.newId();
        const query = ecs.query().tag(randomTag);
        let iter = 0;
        for (const _ of query.iter()) {
            iter++;
        }
        (0, globals_1.expect)(iter).toBe(0);
    });
    (0, globals_1.it)("querying for tag that some entities have returns results", () => {
        const ecs = new index_1.Ecs({
            components: {
                position: { x: "f64", y: "f64", z: "f64" },
                controller: { up: "i32", down: "i32" },
                inventory: { weight: "i32", items: "i32" },
                playerType: { type: "i32" },
                time: { value: "f32" }
            }
        });
        const e1 = ecs.newId();
        const e2 = ecs.newId();
        const tag = ecs.newId();
        ecs.addId(e1, tag);
        ecs.addId(e2, tag);
        const query = ecs.query().tag(tag);
        let iter = 0;
        let entityCount = 0;
        for (const { table, start, end } of query.iter()) {
            entityCount += (end - start);
            (0, globals_1.expect)(table.has(tag)).toBe(true);
            iter++;
        }
        (0, globals_1.expect)(entityCount).toBe(2);
        (0, globals_1.expect)(iter).toBeGreaterThan(0);
    });
    (0, globals_1.it)("querying for tag that some entities have returns results (multiple tags)", () => {
        const ecs = new index_1.Ecs({
            components: {
                position: { x: "f64", y: "f64", z: "f64" },
                controller: { up: "i32", down: "i32" },
                inventory: { weight: "i32", items: "i32" },
                playerType: { type: "i32" },
                time: { value: "f32" }
            }
        });
        const e1 = ecs.newId();
        const e2 = ecs.newId();
        const tag = ecs.newId();
        ecs.addId(e1, tag);
        ecs.addId(e2, tag);
        const tag2 = ecs.newId();
        ecs.addId(e1, tag2);
        ecs.addId(e2, tag2);
        const query = ecs.query().tag(tag).tag(tag2);
        let iter = 0;
        let entityCount = 0;
        for (const { table, start, end } of query.iter()) {
            entityCount += (end - start);
            (0, globals_1.expect)(table.has(tag)).toBe(true);
            (0, globals_1.expect)(table.has(tag2)).toBe(true);
            iter++;
        }
        (0, globals_1.expect)(entityCount).toBe(2);
        (0, globals_1.expect)(iter).toBeGreaterThan(0);
    });
    (0, globals_1.it)("querying for relationships works as well", () => {
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
        const { relations: r } = ecs;
        const e1 = ecs.newId();
        const e2 = ecs.newId();
        const tag = ecs.newId();
        ecs.addId(e1, tag);
        ecs.addId(e2, tag);
        const apples = ecs.newId();
        ecs.addRelationship(e1, r.eats, apples);
        ecs.addRelationship(e2, r.eats, apples);
        const query = ecs.query()
            .tag(tag)
            .relationship(r.eats, apples);
        let iter = 0;
        let entityCount = 0;
        for (const { table, start, end } of query.iter()) {
            entityCount += (end - start);
            (0, globals_1.expect)(table.has(tag)).toBe(true);
            (0, globals_1.expect)(table.hasRelationship(r.eats, apples)).toBe(true);
            iter++;
        }
        (0, globals_1.expect)(entityCount).toBe(2);
        (0, globals_1.expect)(iter).toBeGreaterThan(0);
    });
});
(0, globals_1.describe)("tags and components", () => {
    (0, globals_1.it)("can query for a combination of tags and components", () => {
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
        const { relations: r, components: c } = ecs;
        const e1 = ecs.newId();
        const e2 = ecs.newId();
        const tag = ecs.newId();
        ecs.addId(e1, tag);
        ecs.addId(e2, tag);
        const apples = ecs.newId();
        ecs.addRelationship(e1, r.eats, apples);
        ecs.addRelationship(e2, r.eats, apples);
        ecs.addComponent(e1, c.time);
        ecs.addComponent(e2, c.time);
        const query = ecs.query()
            .tag(tag)
            .relationship(r.eats, apples)
            .component(c.time);
        let iter = 0;
        let entityCount = 0;
        for (const { table, start, end } of query.iter()) {
            entityCount += (end - start);
            (0, globals_1.expect)(table.has(c.time)).toBe(true);
            (0, globals_1.expect)(table.get(c.time)).not.toBe(null);
            (0, globals_1.expect)(table.has(tag)).toBe(true);
            (0, globals_1.expect)(table.hasRelationship(r.eats, apples)).toBe(true);
            iter++;
        }
        (0, globals_1.expect)(entityCount).toBe(2);
        (0, globals_1.expect)(iter).toBeGreaterThan(0);
    });
});
