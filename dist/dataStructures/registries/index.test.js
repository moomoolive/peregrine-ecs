"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const index_1 = require("./index");
const index_2 = require("../../components/index");
(0, globals_1.describe)("component registry", () => {
    (0, globals_1.it)("should generate object will inputted keys", () => {
        const components = (0, index_1.componentRegistryMacro)({
            likeability: { x: "i8" },
            pets: { age: "u16", type: "u8" }
        });
        (0, globals_1.expect)(components.likeability).toBe(0);
        (0, globals_1.expect)(components.pets).toBe(1);
        const components2 = (0, index_1.componentRegistryMacro)({
            position: { x: "f32", y: "f32", z: "f32" },
            velocity: { x: "f32", y: "f32", z: "f32" }
        });
        (0, globals_1.expect)(components2.position).toBe(0);
        (0, globals_1.expect)(components2.velocity).toBe(1);
    });
    (0, globals_1.it)("should throw error if attempting to set key", () => {
        const components = (0, index_1.componentRegistryMacro)({
            likeability: { x: "i8" },
            pets: { age: "u16", type: "u8" }
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
(0, globals_1.describe)("component registry debug tools", () => {
    (0, globals_1.it)("debug tools returns correct metrics", () => {
        const defs = {
            cat: { cuteness: "u8", angry: "u8" },
            bird: { maxFlightHeight: "i32", weight: "u16" }
        };
        const components = [
            (0, index_2.componentMacro)("cat", defs.cat),
            (0, index_2.componentMacro)("bird", defs.bird),
        ];
        const registry = (0, index_1.componentRegistryMacro)(defs);
        {
            const { definition, name, bytesPerElement, id, stringifiedDef } = (0, index_1.debugComponent)(registry.cat, components);
            (0, globals_1.expect)(definition).toEqual([
                { name: "cuteness", type: "u8", ptrOffset: 0 },
                { name: "angry", type: "u8", ptrOffset: 1 },
                { name: "$component_segments_ptr", type: "i32", ptrOffset: 2 },
            ]);
            (0, globals_1.expect)(JSON.parse(stringifiedDef)).toEqual({ cuteness: "u8", angry: "u8" });
            (0, globals_1.expect)(id).toBe(0);
            (0, globals_1.expect)(name).toBe("cat");
            (0, globals_1.expect)(bytesPerElement).toBe(2);
        }
        {
            const { definition, name, bytesPerElement, id, stringifiedDef } = (0, index_1.debugComponent)(registry.bird, components);
            (0, globals_1.expect)(definition).toEqual([
                { name: "maxFlightHeight", type: "i32", ptrOffset: 0 },
                { name: "weight", type: "u16", ptrOffset: 1 },
                { name: "$component_segments_ptr", type: "i32", ptrOffset: 2 },
            ]);
            (0, globals_1.expect)(JSON.parse(stringifiedDef)).toEqual({ maxFlightHeight: "i32", weight: "u16" });
            (0, globals_1.expect)(id).toBe(1);
            (0, globals_1.expect)(name).toBe("bird");
            (0, globals_1.expect)(bytesPerElement).toBe(6);
        }
    });
});
