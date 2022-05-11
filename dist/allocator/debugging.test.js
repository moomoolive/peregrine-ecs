"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const index_1 = require("./index");
const index_2 = require("../components/index");
const debugging_1 = require("./debugging");
const allocator = (0, index_1.createComponentAllocator)(1024, false);
(0, globals_1.afterEach)(() => {
    allocator.freeAll();
});
(0, globals_1.describe)("component pointers debugging", () => {
    (0, globals_1.it)("correct debug information is generated", () => {
        const position = (0, index_2.componentMacro)("position", {
            x: "f64",
            y: "f64",
            z: "f64"
        });
        const p = new position(5, allocator);
        (0, globals_1.expect)(p.$allocatorPtrs.length).toBe(position.tokens.length);
        const { componentSegmentsPtr, fieldPointers } = (0, debugging_1.debugComponentPtrs)(p.$allocatorPtrs, position.tokens);
        (0, globals_1.expect)(typeof componentSegmentsPtr.rawPtrAddress).toBe("number");
        (0, globals_1.expect)(typeof componentSegmentsPtr.prettyPtrAddress).toBe("string");
        (0, globals_1.expect)(componentSegmentsPtr.prettyPtrAddress.includes(componentSegmentsPtr.rawPtrAddress.toString())).toBe(true);
        const addressMap = new Map();
        addressMap.set(componentSegmentsPtr.rawPtrAddress, true);
        (0, globals_1.expect)(fieldPointers.length).toBe(3);
        fieldPointers.forEach(({ rawPtrAddress, prettyPtrAddress, type, name }, index) => {
            /* each component segment has a unique address, that doesn't conflict with base pointer */
            (0, globals_1.expect)(addressMap.get(rawPtrAddress)).toBe(undefined);
            addressMap.set(rawPtrAddress, true);
            (0, globals_1.expect)(prettyPtrAddress.includes(rawPtrAddress.toString())).toBe(true);
            if (index === 0) {
                (0, globals_1.expect)(type).toBe("f64");
                (0, globals_1.expect)(name).toBe("x");
            }
            else if (index === 1) {
                (0, globals_1.expect)(type).toBe("f64");
                (0, globals_1.expect)(name).toBe("y");
            }
            else if (index === 2) {
                (0, globals_1.expect)(type).toBe("f64");
                (0, globals_1.expect)(name).toBe("z");
            }
        });
    });
    (0, globals_1.it)("correct debug information is generated", () => {
        const animation = (0, index_2.componentMacro)("animation", {
            position: "i32",
            face: "i8"
        });
        const p = new animation(5, allocator);
        (0, globals_1.expect)(p.$allocatorPtrs.length).toBe(animation.tokens.length);
        const { componentSegmentsPtr, fieldPointers } = (0, debugging_1.debugComponentPtrs)(p.$allocatorPtrs, animation.tokens);
        (0, globals_1.expect)(typeof componentSegmentsPtr.rawPtrAddress).toBe("number");
        (0, globals_1.expect)(typeof componentSegmentsPtr.prettyPtrAddress).toBe("string");
        (0, globals_1.expect)(componentSegmentsPtr.prettyPtrAddress.includes(componentSegmentsPtr.rawPtrAddress.toString())).toBe(true);
        const addressMap = new Map();
        addressMap.set(componentSegmentsPtr.rawPtrAddress, true);
        (0, globals_1.expect)(fieldPointers.length).toBe(2);
        fieldPointers.forEach(({ rawPtrAddress, prettyPtrAddress, type, name }, index) => {
            /* each component segment has a unique address, that doesn't conflict with base pointer */
            (0, globals_1.expect)(addressMap.get(rawPtrAddress)).toBe(undefined);
            addressMap.set(rawPtrAddress, true);
            (0, globals_1.expect)(prettyPtrAddress.includes(rawPtrAddress.toString())).toBe(true);
            if (index === 0) {
                (0, globals_1.expect)(type).toBe("i32");
                (0, globals_1.expect)(name).toBe("position");
            }
            else if (index === 1) {
                (0, globals_1.expect)(type).toBe("i8");
                (0, globals_1.expect)(name).toBe("face");
            }
        });
    });
});
