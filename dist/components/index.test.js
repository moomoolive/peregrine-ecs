"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const index_1 = require("../allocator/index");
const index_2 = require("./index");
const allocator = (0, index_1.createComponentAllocator)(1024, false);
(0, globals_1.afterEach)(() => { allocator.freeAll(); });
(0, globals_1.describe)("component generation", () => {
    (0, globals_1.it)("components are generated with correct key names and data types", () => {
        const position = (0, index_2.componentMacro)("position", {
            x: "f64",
            y: "f64",
            z: "f64"
        });
        console.log(position.toString());
        const pos = new position(10, allocator);
        const p = pos.data;
        (0, globals_1.expect)(pos.databuffers.length).toBe(3);
        (0, globals_1.expect)(pos.databuffers[0]).toBeInstanceOf(Float64Array);
        (0, globals_1.expect)(pos.databuffers[1]).toBeInstanceOf(Float64Array);
        (0, globals_1.expect)(pos.databuffers[2]).toBeInstanceOf(Float64Array);
        (0, globals_1.expect)(p.x).toBeInstanceOf(Float64Array);
        (0, globals_1.expect)(p.y).toBeInstanceOf(Float64Array);
        (0, globals_1.expect)(p.z).toBeInstanceOf(Float64Array);
        (0, globals_1.expect)(pos.$allocatorPtrs).toBeInstanceOf(Int32Array);
        (0, globals_1.expect)(pos.$allocatorPtrs.length).toBe(position.tokens.length);
        (0, globals_1.expect)(p.x.length).toBe(10);
        (0, globals_1.expect)(p.y.length).toBe(10);
        (0, globals_1.expect)(p.z.length).toBe(10);
        const animation = (0, index_2.componentMacro)("animation", {
            position: "i32",
            face: "i8"
        });
        const anim = new animation(5, allocator);
        const a = anim.data;
        (0, globals_1.expect)(anim.databuffers[0]).toBeInstanceOf(Int32Array);
        (0, globals_1.expect)(anim.databuffers[1]).toBeInstanceOf(Int8Array);
        (0, globals_1.expect)(a.face).toBeInstanceOf(Int8Array);
        (0, globals_1.expect)(a.position).toBeInstanceOf(Int32Array);
        (0, globals_1.expect)(anim.$allocatorPtrs).toBeInstanceOf(Int32Array);
        (0, globals_1.expect)(anim.$allocatorPtrs.length).toBe(animation.tokens.length);
        (0, globals_1.expect)(a.face.length).toBe(5);
        (0, globals_1.expect)(a.position.length).toBe(5);
    });
    (0, globals_1.it)("utility methods exist for generated components", () => {
        const color = (0, index_2.componentMacro)("color", {
            red: 'u8',
            blue: "u8",
            green: "u8"
        });
        (0, globals_1.expect)(JSON.parse(color.stringifiedDef)).toEqual({
            red: 'u8',
            blue: "u8",
            green: "u8"
        });
        (0, globals_1.expect)(typeof color.proxyClass).toBe("function");
        console.log(color.proxyClass.toString());
        (0, globals_1.expect)(color.bytesPerElement).toBe(3);
        (0, globals_1.expect)(color.tokens).toEqual([
            {
                name: "red",
                type: "u8",
                ptrOffset: 0
            },
            {
                name: "blue",
                type: "u8",
                ptrOffset: 1
            },
            {
                name: "green",
                type: "u8",
                ptrOffset: 2
            },
            {
                name: "$component_segments_ptr",
                type: "i32",
                ptrOffset: Object.keys({
                    red: 'u8',
                    blue: "u8",
                    green: "u8"
                }).length
            }
        ]);
    });
});
