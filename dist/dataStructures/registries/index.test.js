"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const index_1 = require("./index");
const index_2 = require("../../components/index");
const ids_1 = require("../../entities/ids");
(0, globals_1.describe)("component registry", () => {
    (0, globals_1.it)("should generate object will inputted keys", () => {
        const defs = {
            likeability: { x: "i32" },
            pets: { age: "i32", type: "i32" }
        };
        const names = (0, index_2.orderComponentsByName)(defs);
        const components = (0, index_1.componentRegistryMacro)(names);
        (0, globals_1.expect)(typeof components.likeability).toBe("number");
        (0, globals_1.expect)(typeof components.pets).toBe("number");
        const defs2 = {
            position: { x: "f32", y: "f32", z: "f32" },
            velocity: { x: "f32", y: "f32", z: "f32" }
        };
        const names2 = (0, index_2.orderComponentsByName)(defs2);
        const components2 = (0, index_1.componentRegistryMacro)(names2);
        (0, globals_1.expect)(typeof components2.position).toBe("number");
        (0, globals_1.expect)(typeof components2.velocity).toBe("number");
    });
    (0, globals_1.it)("component registry should be immutable", () => {
        const def = {
            likeability: { x: "i32" },
            pets: { age: "i32", type: "i32" }
        };
        const names = (0, index_2.orderComponentsByName)(def);
        const components = (0, index_1.componentRegistryMacro)(names);
        // @ts-ignore
        (0, globals_1.expect)(() => components.likeability = 2).toThrow();
    });
    (0, globals_1.it)("component ids in registry should be marked as immutable", () => {
        const def = {
            likeability: { x: "i32" },
            pets: { age: "i32", type: "i32" }
        };
        const names = (0, index_2.orderComponentsByName)(def);
        const components = (0, index_1.componentRegistryMacro)(names);
        (0, globals_1.expect)((0, ids_1.isImmutable)(components.likeability)).toBe(true);
        (0, globals_1.expect)((0, ids_1.isImmutable)(components.pets)).toBe(true);
    });
    (0, globals_1.it)("should throw error if input is object with no keys", () => {
        (0, globals_1.expect)(() => (0, index_1.componentRegistryMacro)([])).toThrow();
    });
    (0, globals_1.it)("should throw error if input has more keys than maximum", () => {
        const max = [];
        for (let i = 0; i < 256 /* max_components */ + 1; i++) {
            max.push("field" + i.toString());
        }
        (0, globals_1.expect)(() => (0, index_1.componentRegistryMacro)(max)).toThrow();
    });
});
(0, globals_1.describe)("relation registry (id registry generation)", () => {
    (0, globals_1.it)("inputting incorrect type to relation registry should throw error", () => {
        (0, globals_1.expect)(() => (0, index_1.relationRegistryMacro)(null)).toThrow();
        (0, globals_1.expect)(() => (0, index_1.relationRegistryMacro)(0)).toThrow();
        (0, globals_1.expect)(() => (0, index_1.relationRegistryMacro)(true)).toThrow();
        (0, globals_1.expect)(() => (0, index_1.relationRegistryMacro)("relations")).toThrow();
        (0, globals_1.expect)(() => (0, index_1.relationRegistryMacro)(Symbol())).toThrow();
        (0, globals_1.expect)(() => (0, index_1.relationRegistryMacro)(undefined)).toThrow();
        (0, globals_1.expect)(() => (0, index_1.relationRegistryMacro)([])).toThrow();
    });
    (0, globals_1.it)("inputting incorrect entity type should throw error", () => {
        (0, globals_1.expect)(() => (0, index_1.relationRegistryMacro)({ rel: null })).toThrow();
        (0, globals_1.expect)(() => (0, index_1.relationRegistryMacro)({ rel: undefined })).toThrow();
        (0, globals_1.expect)(() => (0, index_1.relationRegistryMacro)({ rel: 2 })).toThrow();
        (0, globals_1.expect)(() => (0, index_1.relationRegistryMacro)({ rel: "no a real component" })).toThrow();
        (0, globals_1.expect)(() => (0, index_1.relationRegistryMacro)({ rel: true })).toThrow();
        (0, globals_1.expect)(() => (0, index_1.relationRegistryMacro)({ rel: Symbol() })).toThrow();
    });
    (0, globals_1.it)("should generate object with inputted keys", () => {
        const { registry: relations } = (0, index_1.relationRegistryMacro)({
            marriedTo: "immutable",
            eats: "immutable",
            livesIn: "reserved",
            hates: "immutable"
        });
        (0, globals_1.expect)(typeof relations.eats).toBe("number");
        (0, globals_1.expect)(typeof relations.livesIn).toBe("number");
        (0, globals_1.expect)(typeof relations.hates).toBe("number");
        (0, globals_1.expect)(typeof relations.marriedTo).toBe("number");
    });
    (0, globals_1.it)("relations registry should be immutable", () => {
        const { registry: relations } = (0, index_1.relationRegistryMacro)({
            marriedTo: "immutable",
            eats: "immutable",
            livesIn: "reserved",
            hates: "immutable"
        });
        // @ts-ignore
        (0, globals_1.expect)(() => relations.eats = 4).toThrow();
    });
    (0, globals_1.it)("relations declared as immutable should have immutable ids, otherwise they shouldn't", () => {
        const { registry: relations } = (0, index_1.relationRegistryMacro)({
            marriedTo: "immutable",
            eats: "immutable",
            livesIn: "reserved",
            hates: "immutable"
        });
        (0, globals_1.expect)((0, ids_1.isImmutable)(relations.marriedTo)).toBe(true);
        (0, globals_1.expect)((0, ids_1.isImmutable)(relations.eats)).toBe(true);
        (0, globals_1.expect)((0, ids_1.isImmutable)(relations.livesIn)).toBe(false);
        (0, globals_1.expect)((0, ids_1.isImmutable)(relations.hates)).toBe(true);
    });
});
