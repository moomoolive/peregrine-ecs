"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const index_1 = require("./index");
(0, globals_1.describe)("component registry", () => {
    (0, globals_1.it)("should generate object will inputted keys", () => {
        const components = (0, index_1.componentRegistryMacro)({
            likeability: { x: "i32" },
            pets: { age: "i32", type: "i32" }
        });
        (0, globals_1.expect)(components.likeability).toBe(50 /* reserved_end */ + 0);
        (0, globals_1.expect)(components.pets).toBe(50 /* reserved_end */ + 1);
        const components2 = (0, index_1.componentRegistryMacro)({
            position: { x: "f32", y: "f32", z: "f32" },
            velocity: { x: "f32", y: "f32", z: "f32" }
        });
        (0, globals_1.expect)(components2.position).toBe(50 /* reserved_end */ + 0);
        (0, globals_1.expect)(components2.velocity).toBe(50 /* reserved_end */ + 1);
    });
    (0, globals_1.it)("component ids should ascend alphabetically", () => {
        const { c, b, a } = (0, index_1.componentRegistryMacro)({
            c: { val: "i32" },
            b: { val: "i32" },
            a: { val: "i32" },
        });
        (0, globals_1.expect)(c).toBeGreaterThan(b);
        (0, globals_1.expect)(b).toBeGreaterThan(a);
    });
    (0, globals_1.it)("should throw error if attempting to set key", () => {
        const components = (0, index_1.componentRegistryMacro)({
            likeability: { x: "i32" },
            pets: { age: "i32", type: "i32" }
        });
        // @ts-ignore
        (0, globals_1.expect)(() => components.likeability = 2).toThrow();
    });
    (0, globals_1.it)("should throw error if input is object with no keys", () => {
        (0, globals_1.expect)(() => (0, index_1.componentRegistryMacro)({})).toThrow();
    });
    (0, globals_1.it)("should throw error if input has more keys than maximum", () => {
        const max = {};
        for (let i = 0; i < index_1.MAX_COMPONENTS + 1; i++) {
            max["field" + i.toString()] = {};
        }
        (0, globals_1.expect)(() => (0, index_1.componentRegistryMacro)(max)).toThrow();
    });
});
