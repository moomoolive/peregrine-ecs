"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const index_1 = require("./index");
(0, globals_1.describe)("table hashing", () => {
    (0, globals_1.it)("additional tag id hash", () => {
        const referingTableComponentIds = new Int32Array([1]);
        const tag = 5600;
        const componentsLength = 0;
        const { hash, insertIndex } = (0, index_1.computeAdditonalTagHash)(referingTableComponentIds, tag, componentsLength);
        (0, globals_1.expect)(hash).toBe("&.1.5600");
        /* signal that new tag should be added at the end */
        (0, globals_1.expect)(insertIndex).toBe(-1 /* last_index */);
    });
    (0, globals_1.it)("additional tag hash generated for multiple pre-existing tags", () => {
        const referingTableComponentIds = new Int32Array([1, 5600]);
        const tag = 55;
        const componentsLength = 0;
        const { hash, insertIndex } = (0, index_1.computeAdditonalTagHash)(referingTableComponentIds, tag, componentsLength);
        (0, globals_1.expect)(hash).toBe("&.1.55.5600");
        (0, globals_1.expect)(insertIndex).toBe(1);
    });
    (0, globals_1.it)("additional tag hash generated for multiple pre-existing components & tags", () => {
        const referingTableComponentIds = new Int32Array([1, 4, 6, 777, 5600]);
        const tag = 9888;
        const componentsLength = 3;
        const { hash, insertIndex } = (0, index_1.computeAdditonalTagHash)(referingTableComponentIds, tag, componentsLength);
        (0, globals_1.expect)(hash).toBe(".1.4.6&.777.5600.9888");
        (0, globals_1.expect)(insertIndex).toBe(-1 /* last_index */);
    });
});
