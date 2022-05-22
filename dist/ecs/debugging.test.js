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
        (0, globals_1.expect)(ecs.componentCount).toBe(4);
        const comps = ecs["~all_components_info"]();
        {
            const { name, bytesPerElement, stringifiedDef, } = comps.find(({ name }) => name === "controller");
            (0, globals_1.expect)(name).toBe("controller");
            (0, globals_1.expect)(bytesPerElement).toBe(8);
            const { controller } = ecs.declaredComponents;
            (0, globals_1.expect)(JSON.parse(stringifiedDef)).toEqual(controller);
        }
        {
            const { name, bytesPerElement, stringifiedDef, } = comps.find(({ name }) => name === "playerType");
            (0, globals_1.expect)(name).toBe("playerType");
            (0, globals_1.expect)(bytesPerElement).toBe(4);
            const { playerType } = ecs.declaredComponents;
            (0, globals_1.expect)(JSON.parse(stringifiedDef)).toEqual(playerType);
        }
    });
    (0, globals_1.it)("should be able to debug component  through it's registry key", () => {
        const { components, declaredComponents } = ecs;
        {
            const { name, stringifiedDef } = ecs["~debug_component"](components.controller);
            (0, globals_1.expect)(name).toBe("controller");
            (0, globals_1.expect)(JSON.parse(stringifiedDef)).toEqual(declaredComponents.controller);
        }
        {
            const { name, stringifiedDef } = ecs["~debug_component"](components.inventory);
            (0, globals_1.expect)(name).toBe("inventory");
            (0, globals_1.expect)(JSON.parse(stringifiedDef)).toEqual(declaredComponents.inventory);
        }
    });
    (0, globals_1.it)("attempting to debug a non component with component debug should throw", () => {
        const nonComponent = ecs.newId();
        (0, globals_1.expect)(() => ecs["~debug_component"](nonComponent)).toThrow();
    });
});
