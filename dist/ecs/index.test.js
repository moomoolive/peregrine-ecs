"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const index_1 = require("./index");
(0, globals_1.describe)("ecs defines components correctly", () => {
    (0, globals_1.it)("should be able to retrieve correct debug info about component", () => {
        const Ecs = (0, index_1.defineEcs)({
            components: {
                position: { x: "f64", y: "f64", z: "f64" },
                velocity: { x: "f64", y: "f64", z: "f64" },
                npcs: { hair: "u16", health: "u16" }
            }
        });
        const ecs = new Ecs();
        (0, globals_1.expect)(JSON.parse(ecs.debugger.stringifiedComponentDeclaration)).toEqual({
            position: { x: "f64", y: "f64", z: "f64" },
            velocity: { x: "f64", y: "f64", z: "f64" },
            npcs: { hair: "u16", health: "u16" }
        });
        {
            const { definition, bytesPerElement, name, id, stringifiedDef } = ecs.debugger.componentInfo(ecs.components.position);
            (0, globals_1.expect)(definition).toEqual([
                { name: "x", type: "f64", ptrOffset: 0 },
                { name: "y", type: "f64", ptrOffset: 1 },
                { name: "z", type: "f64", ptrOffset: 2 },
                { name: "$component_segments_ptr", type: "i32", ptrOffset: 3 }
            ]);
            (0, globals_1.expect)(JSON.parse(stringifiedDef)).toEqual({ x: "f64", y: "f64", z: "f64" });
            (0, globals_1.expect)(bytesPerElement).toBe(24);
            (0, globals_1.expect)(name).toBe("position");
            (0, globals_1.expect)(id).toBe(0);
        }
        {
            const { definition, bytesPerElement, name, id, stringifiedDef } = ecs.debugger.componentInfo(ecs.components.velocity);
            (0, globals_1.expect)(definition).toEqual([
                { name: "x", type: "f64", ptrOffset: 0 },
                { name: "y", type: "f64", ptrOffset: 1 },
                { name: "z", type: "f64", ptrOffset: 2 },
                { name: "$component_segments_ptr", type: "i32", ptrOffset: 3 }
            ]);
            (0, globals_1.expect)(JSON.parse(stringifiedDef)).toEqual({ x: "f64", y: "f64", z: "f64" });
            (0, globals_1.expect)(bytesPerElement).toBe(24);
            (0, globals_1.expect)(name).toBe("velocity");
            (0, globals_1.expect)(id).toBe(1);
        }
        {
            const { definition, bytesPerElement, name, id, stringifiedDef } = ecs.debugger.componentInfo(ecs.components.npcs);
            (0, globals_1.expect)(definition).toEqual([
                { name: "hair", type: "u16", ptrOffset: 0 },
                { name: "health", type: "u16", ptrOffset: 1 },
                { name: "$component_segments_ptr", type: "i32", ptrOffset: 2 }
            ]);
            (0, globals_1.expect)(JSON.parse(stringifiedDef)).toEqual({ hair: "u16", health: "u16" });
            (0, globals_1.expect)(bytesPerElement).toBe(4);
            (0, globals_1.expect)(name).toBe("npcs");
            (0, globals_1.expect)(id).toBe(2);
        }
    });
    (0, globals_1.it)("should be able to retrieve all component debug info at once", () => {
        const Ecs = (0, index_1.defineEcs)({
            components: {
                position: { x: "f64", y: "f64", z: "f64" },
                velocity: { x: "f64", y: "f64", z: "f64" },
                npcs: { hair: "u16", health: "u16" }
            }
        });
        const ecs = new Ecs();
        const debug = ecs.debugger.allComponents();
        {
            const { definition, bytesPerElement, name, id, stringifiedDef } = debug[0];
            (0, globals_1.expect)(definition).toEqual([
                { name: "x", type: "f64", ptrOffset: 0 },
                { name: "y", type: "f64", ptrOffset: 1 },
                { name: "z", type: "f64", ptrOffset: 2 },
                { name: "$component_segments_ptr", type: "i32", ptrOffset: 3 }
            ]);
            (0, globals_1.expect)(JSON.parse(stringifiedDef)).toEqual({ x: "f64", y: "f64", z: "f64" });
            (0, globals_1.expect)(bytesPerElement).toBe(24);
            (0, globals_1.expect)(name).toBe("position");
            (0, globals_1.expect)(id).toBe(0);
        }
        {
            const { definition, bytesPerElement, name, id, stringifiedDef } = debug[1];
            (0, globals_1.expect)(definition).toEqual([
                { name: "x", type: "f64", ptrOffset: 0 },
                { name: "y", type: "f64", ptrOffset: 1 },
                { name: "z", type: "f64", ptrOffset: 2 },
                { name: "$component_segments_ptr", type: "i32", ptrOffset: 3 }
            ]);
            (0, globals_1.expect)(JSON.parse(stringifiedDef)).toEqual({ x: "f64", y: "f64", z: "f64" });
            (0, globals_1.expect)(bytesPerElement).toBe(24);
            (0, globals_1.expect)(name).toBe("velocity");
            (0, globals_1.expect)(id).toBe(1);
        }
        {
            const { definition, bytesPerElement, name, id, stringifiedDef } = debug[2];
            (0, globals_1.expect)(definition).toEqual([
                { name: "hair", type: "u16", ptrOffset: 0 },
                { name: "health", type: "u16", ptrOffset: 1 },
                { name: "$component_segments_ptr", type: "i32", ptrOffset: 2 }
            ]);
            (0, globals_1.expect)(JSON.parse(stringifiedDef)).toEqual({ hair: "u16", health: "u16" });
            (0, globals_1.expect)(bytesPerElement).toBe(4);
            (0, globals_1.expect)(name).toBe("npcs");
            (0, globals_1.expect)(id).toBe(2);
        }
    });
    (0, globals_1.it)("should be able to retrieve correct number of component count", () => {
        const Ecs = (0, index_1.defineEcs)({
            components: {
                position: { x: "f64", y: "f64", z: "f64" },
                velocity: { x: "f64", y: "f64", z: "f64" },
                npcs: { hair: "u16", health: "u16" }
            }
        });
        const ecs = new Ecs();
        (0, globals_1.expect)(ecs.debugger.componentCount).toBe(3);
    });
});
