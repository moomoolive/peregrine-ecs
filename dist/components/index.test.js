"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const index_1 = require("./index");
(0, globals_1.describe)("component generation", () => {
    (0, globals_1.it)("components are generated with correct key names and data types", () => {
        const { View, componentSegements, bytesPerElement, bytesPerField, memoryConstructor, tokens, id, name } = (0, index_1.componentViewMacro)(0, "position", {
            x: "f64",
            y: "f64",
            z: "f64"
        });
        (0, globals_1.expect)(name).toBe("position");
        (0, globals_1.expect)(id).toBe(0);
        (0, globals_1.expect)(componentSegements).toBe(3);
        (0, globals_1.expect)(bytesPerField).toBe(8);
        (0, globals_1.expect)(bytesPerElement).toBe(24);
        (0, globals_1.expect)(memoryConstructor).toBe(Float64Array);
        (0, globals_1.expect)(tokens.memoryType).toBe("f64");
        (0, globals_1.expect)(tokens.fields).toEqual([
            { name: "x", databufferOffset: 0, originalDatabufferOffset: 0 },
            { name: "y", databufferOffset: 1, originalDatabufferOffset: 1 },
            { name: "z", databufferOffset: 2, originalDatabufferOffset: 2 },
        ]);
        const databuffer = new memoryConstructor(5 * componentSegements);
        const pos = new View({ databuffer });
        (0, globals_1.expect)(typeof pos.x).toBe("function");
        (0, globals_1.expect)(typeof pos.set_x).toBe("function");
        (0, globals_1.expect)(typeof pos.y).toBe("function");
        (0, globals_1.expect)(typeof pos.set_y).toBe("function");
        (0, globals_1.expect)(typeof pos.z).toBe("function");
        (0, globals_1.expect)(typeof pos.set_z).toBe("function");
        pos.set_x(3, 10.2);
        (0, globals_1.expect)(pos.x(3)).toBe(10.2);
        pos.set_y(1, 5.0);
        (0, globals_1.expect)(pos.y(1)).toBe(5.0);
        pos.set_z(0, 350230.33);
        (0, globals_1.expect)(pos.z(0)).toBe(350230.33);
        {
            const { View, componentSegements, bytesPerElement, bytesPerField, memoryConstructor, tokens, id, name } = (0, index_1.componentViewMacro)(1, "animation", {
                position: "i32",
                face: "i32"
            });
            (0, globals_1.expect)(name).toBe("animation");
            (0, globals_1.expect)(id).toBe(1);
            (0, globals_1.expect)(componentSegements).toBe(2);
            (0, globals_1.expect)(bytesPerField).toBe(4);
            (0, globals_1.expect)(bytesPerElement).toBe(8);
            (0, globals_1.expect)(memoryConstructor).toBe(Int32Array);
            (0, globals_1.expect)(tokens.memoryType).toBe("i32");
            /* fields are sorted alphabetically by name */
            (0, globals_1.expect)(tokens.fields).toEqual([
                {
                    name: "face",
                    databufferOffset: 0,
                    originalDatabufferOffset: 1
                },
                {
                    name: "position",
                    databufferOffset: 1,
                    originalDatabufferOffset: 0
                },
            ]);
            const databuffer = new memoryConstructor(componentSegements * 5);
            const anim = new View({ databuffer });
            (0, globals_1.expect)(typeof anim.position).toBe("function");
            (0, globals_1.expect)(typeof anim.set_position).toBe("function");
            (0, globals_1.expect)(typeof anim.face).toBe("function");
            (0, globals_1.expect)(typeof anim.set_face).toBe("function");
            anim.set_face(0, 2);
            (0, globals_1.expect)(anim.face(0)).toBe(2);
            anim.set_face(3, 1000);
            (0, globals_1.expect)(anim.face(3)).toBe(1000);
            anim.set_position(1, 5);
            (0, globals_1.expect)(anim.position(1)).toBe(5);
        }
    });
});
