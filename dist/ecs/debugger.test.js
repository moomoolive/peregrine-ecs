"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const index_1 = require("./index");
(0, globals_1.describe)("component debugging", () => {
    const ecs = new index_1.Ecs({
        components: {
            position: { x: "f64", y: "f64", z: "f64" },
            controller: { up: "i32", down: "i32" },
            inventory: { weight: "i32", items: "i32" },
            playerType: { type: "i32" }
        }
    });
    (0, globals_1.it)("correct number of debug logs should be generated for inputted components", () => {
        (0, globals_1.expect)(ecs.debug.componentCount).toBe(4);
        const comps = ecs.debug.allComponents();
        {
            const { id, name, bytesPerElement, stringifiedDef, } = comps[1];
            (0, globals_1.expect)(name).toBe("controller");
            (0, globals_1.expect)(bytesPerElement).toBe(8);
            const { controller } = ecs.debug.schemas;
            (0, globals_1.expect)(JSON.parse(stringifiedDef)).toEqual(controller);
            /* ordering of keys is different */
            (0, globals_1.expect)(Object.keys(stringifiedDef)).not.toEqual(Object.keys(controller));
        }
        {
            const { name, bytesPerElement, stringifiedDef, } = comps[3];
            (0, globals_1.expect)(name).toBe("playerType");
            (0, globals_1.expect)(bytesPerElement).toBe(4);
            const { playerType } = ecs.debug.schemas;
            (0, globals_1.expect)(JSON.parse(stringifiedDef)).toEqual(playerType);
        }
    });
    (0, globals_1.it)("component schemas should be immutable", () => {
        // @ts-ignore
        (0, globals_1.expect)(() => ecs.debug.schemas.controller = {}).toThrow();
    });
});
