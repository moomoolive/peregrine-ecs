"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const allocator_1 = require("./allocator");
const index_1 = require("./index");
const allocator = (0, allocator_1.createComponentAllocator)(1024, false);
(0, globals_1.describe)("component generation", () => {
    (0, globals_1.it)("components are generated with correct key names and data types", () => {
        const position = (0, index_1.componentMacro)("position", {
            x: "f64",
            y: "f64",
            z: "f64"
        });
        console.log(position.toString());
        const p = new position(10, allocator);
        (0, globals_1.expect)(p.x).toBeInstanceOf(Float64Array);
        (0, globals_1.expect)(p.y).toBeInstanceOf(Float64Array);
        (0, globals_1.expect)(p.z).toBeInstanceOf(Float64Array);
        (0, globals_1.expect)(p["&allocatorPtrs"]).toBeInstanceOf(Int32Array);
        (0, globals_1.expect)(p["&allocatorPtrs"].length).toBe(3);
        (0, globals_1.expect)(p.x.length).toBe(10);
        (0, globals_1.expect)(p.y.length).toBe(10);
        (0, globals_1.expect)(p.z.length).toBe(10);
        const animation = (0, index_1.componentMacro)("animation", {
            position: "i32",
            face: "i8"
        });
        const a = new animation(5, allocator);
        (0, globals_1.expect)(a.face).toBeInstanceOf(Int8Array);
        (0, globals_1.expect)(a.position).toBeInstanceOf(Int32Array);
        (0, globals_1.expect)(a["&allocatorPtrs"]).toBeInstanceOf(Int32Array);
        (0, globals_1.expect)(a["&allocatorPtrs"].length).toBe(2);
        (0, globals_1.expect)(a.face.length).toBe(5);
        (0, globals_1.expect)(a.position.length).toBe(5);
    });
    (0, globals_1.it)("utility methods exist for generated components", () => {
        const color = (0, index_1.componentMacro)("color", {
            red: 'u8',
            blue: "u8",
            green: "u8"
        });
        (0, globals_1.expect)(color.def).toEqual({
            red: 'u8',
            blue: "u8",
            green: "u8"
        });
        (0, globals_1.expect)(color.bytesPerElement).toBe(3);
    });
});
