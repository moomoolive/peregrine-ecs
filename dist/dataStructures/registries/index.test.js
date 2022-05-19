"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const index_1 = require("./index");
const index_2 = require("../../components/index");
(0, globals_1.describe)("component registry", () => {
    (0, globals_1.it)("should generate object will inputted keys", () => {
        const defs = {
            likeability: { x: "i32" },
            pets: { age: "i32", type: "i32" }
        };
        const names = (0, index_2.orderComponentsByName)(defs);
        const components = (0, index_1.componentRegistryMacro)(names);
        (0, globals_1.expect)(components.likeability).toBe(50 /* components_start */ + 0);
        (0, globals_1.expect)(components.pets).toBe(50 /* components_start */ + 1);
        const defs2 = {
            position: { x: "f32", y: "f32", z: "f32" },
            velocity: { x: "f32", y: "f32", z: "f32" }
        };
        const names2 = (0, index_2.orderComponentsByName)(defs2);
        const components2 = (0, index_1.componentRegistryMacro)(names2);
        (0, globals_1.expect)(components2.position).toBe(50 /* components_start */ + 0);
        (0, globals_1.expect)(components2.velocity).toBe(50 /* components_start */ + 1);
    });
    (0, globals_1.it)("should throw error if attempting to set key", () => {
        const def = {
            likeability: { x: "i32" },
            pets: { age: "i32", type: "i32" }
        };
        const names = (0, index_2.orderComponentsByName)(def);
        const components = (0, index_1.componentRegistryMacro)(names);
        // @ts-ignore
        (0, globals_1.expect)(() => components.likeability = 2).toThrow();
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
