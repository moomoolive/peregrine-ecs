"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const index_1 = require("./index");
(0, globals_1.describe)("component generation", () => {
    (0, globals_1.it)("components are generated with correct key names and data types", () => {
        const { View, componentSegements, bytesPerElement, bytesPerField, memoryConstructor, tokens, id } = (0, index_1.componentViewMacro)(0, "position", {
            x: "f64",
            y: "f64",
            z: "f64"
        });
        (0, globals_1.expect)(id).toBe(0);
        (0, globals_1.expect)(componentSegements).toBe(3);
        (0, globals_1.expect)(bytesPerField).toBe(8);
        (0, globals_1.expect)(bytesPerElement).toBe(24);
        (0, globals_1.expect)(memoryConstructor).toBe(Float64Array);
        (0, globals_1.expect)(tokens.memoryType).toBe("f64");
        (0, globals_1.expect)(tokens.fields).toEqual([
            { name: "x", databufferOffset: 0 },
            { name: "y", databufferOffset: 1 },
            { name: "z", databufferOffset: 2 },
        ]);
        const databuffers = [];
        for (let i = 0; i < componentSegements; i++) {
            databuffers.push(new memoryConstructor(1));
        }
        const pos = new View(databuffers);
        (0, globals_1.expect)(pos.x).toBeInstanceOf(Float64Array);
        (0, globals_1.expect)(pos.y).toBeInstanceOf(Float64Array);
        (0, globals_1.expect)(pos.z).toBeInstanceOf(Float64Array);
        {
            const { View, componentSegements, bytesPerElement, bytesPerField, memoryConstructor, tokens, id } = (0, index_1.componentViewMacro)(1, "animation", {
                position: "i32",
                face: "i32"
            });
            (0, globals_1.expect)(id).toBe(1);
            (0, globals_1.expect)(componentSegements).toBe(2);
            (0, globals_1.expect)(bytesPerField).toBe(4);
            (0, globals_1.expect)(bytesPerElement).toBe(8);
            (0, globals_1.expect)(memoryConstructor).toBe(Int32Array);
            (0, globals_1.expect)(tokens.memoryType).toBe("i32");
            (0, globals_1.expect)(tokens.fields).toEqual([
                { name: "position", databufferOffset: 0 },
                { name: "face", databufferOffset: 1 },
            ]);
            const databuffers = [];
            for (let i = 0; i < componentSegements; i++) {
                databuffers.push(new memoryConstructor(1));
            }
            const pos = new View(databuffers);
            (0, globals_1.expect)(pos.position).toBeInstanceOf(Int32Array);
            (0, globals_1.expect)(pos.face).toBeInstanceOf(Int32Array);
        }
    });
});
