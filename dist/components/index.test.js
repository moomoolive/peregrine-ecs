"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const index_1 = require("./index");
(0, globals_1.describe)("struct proxy generation", () => {
    (0, globals_1.it)("struct proxies are generated with correct fields", () => {
        const { View, componentSegements, bytesPerElement, bytesPerField, memoryConstructor, tokens, id, name } = (0, index_1.structProxyMacro)(0, "position", {
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
        const pos = new View({ databuffer }, 0);
        pos.x = 10.2;
        (0, globals_1.expect)(pos.x).toBe(10.2);
        pos.y = 5.0;
        (0, globals_1.expect)(pos.y).toBe(5.0);
        pos.z = 350230.33;
        (0, globals_1.expect)(pos.z).toBe(350230.33);
        {
            const { View, componentSegements, bytesPerElement, bytesPerField, memoryConstructor, tokens, id, name } = (0, index_1.structProxyMacro)(1, "animation", {
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
            const anim = new View({ databuffer }, 0);
            anim.face = 2;
            (0, globals_1.expect)(anim.face).toBe(2);
            anim.position = 100000;
            (0, globals_1.expect)(anim.position).toBe(100000);
        }
    });
});
(0, globals_1.describe)("component iteration", () => {
    (0, globals_1.it)("component elements can be iterated over and accessed via struct proxy", () => {
        const proxyClass = (0, index_1.structProxyMacro)(0, "position", {
            x: "f64",
            y: "f64",
            z: "f64"
        });
        const initialCapacity = 5;
        const bytes = (proxyClass.componentSegements
            * initialCapacity
            * proxyClass.bytesPerElement);
        const databuffer = new Int32Array(bytes);
        const component = new index_1.RawComponent(proxyClass.id, proxyClass.bytesPerElement, proxyClass.componentSegements, proxyClass.memoryConstructor, proxyClass.View, databuffer);
        /* can iterate and access indivial elements */
        for (let i = 0; i < initialCapacity; i++) {
            const pos = component.index(i);
            pos.x = i;
            pos.y = i + 1;
            pos.z = i + 2;
            const { x, y, z } = pos;
            (0, globals_1.expect)(x).toBe(i);
            (0, globals_1.expect)(y).toBe(i + 1);
            (0, globals_1.expect)(z).toBe(i + 2);
        }
    });
    (0, globals_1.it)("component elements are distinct and do not affect each other", () => {
        const proxyClass = (0, index_1.structProxyMacro)(0, "position", {
            x: "f64",
            y: "f64",
            z: "f64"
        });
        const initialCapacity = 5;
        const bytes = (proxyClass.componentSegements
            * initialCapacity
            * proxyClass.bytesPerElement);
        const databuffer = new Int32Array(bytes);
        const component = new index_1.RawComponent(proxyClass.id, proxyClass.bytesPerElement, proxyClass.componentSegements, proxyClass.memoryConstructor, proxyClass.View, databuffer);
        {
            const pos = component.index(0);
            pos.x = 1.0;
            pos.y = 1.0 + 1.0;
            pos.z = 1.0 + 2.0;
            const pos1 = component.index(1);
            pos1.x = 4.0;
            pos1.y = 4.0;
            pos1.z = 6.0;
            const { x, y, z } = pos;
            (0, globals_1.expect)(x).toBe(1.0);
            (0, globals_1.expect)(y).toBe(1.0 + 1.0);
            (0, globals_1.expect)(z).toBe(1.0 + 2.0);
        }
        {
            const pos = component.index(0);
            pos.x = 1.0;
            pos.y = 1.0 + 1.0;
            pos.z = 1.0 + 2.0;
            const pos1 = component.index(1);
            pos1.x = pos.x;
            pos1.y = pos.y;
            pos1.z = pos.z;
            const { x, y, z } = pos1;
            (0, globals_1.expect)(x).toBe(1.0);
            (0, globals_1.expect)(y).toBe(1.0 + 1.0);
            (0, globals_1.expect)(z).toBe(1.0 + 2.0);
        }
    });
});
