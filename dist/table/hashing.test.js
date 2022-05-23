"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const hashing_1 = require("./hashing");
(0, globals_1.describe)("additional tag hash", () => {
    (0, globals_1.it)("additional tag id hash at end", () => {
        const referingTableComponentIds = new Int32Array([1]);
        const tag = 5600;
        const componentsLength = 0;
        const { hash, insertIndex } = (0, hashing_1.computeAdditonalTagHash)(referingTableComponentIds, tag, componentsLength);
        (0, globals_1.expect)(hash).toBe("&.1.5600");
        /* signal that new tag should be added at the end */
        (0, globals_1.expect)(insertIndex).toBe(-1 /* last_index */);
    });
    (0, globals_1.it)("additional tag hash generated for multiple pre-existing tags", () => {
        const referingTableComponentIds = new Int32Array([1, 5600]);
        const tag = 55;
        const componentsLength = 0;
        const { hash, insertIndex } = (0, hashing_1.computeAdditonalTagHash)(referingTableComponentIds, tag, componentsLength);
        (0, globals_1.expect)(hash).toBe("&.1.55.5600");
        (0, globals_1.expect)(insertIndex).toBe(1);
    });
    (0, globals_1.it)("additional tag hash generated for multiple pre-existing components & tags", () => {
        const referingTableComponentIds = new Int32Array([1, 4, 6, 777, 5600]);
        const tag = 9888;
        const componentsLength = 3;
        const { hash, insertIndex } = (0, hashing_1.computeAdditonalTagHash)(referingTableComponentIds, tag, componentsLength);
        (0, globals_1.expect)(hash).toBe(".1.4.6&.777.5600.9888");
        (0, globals_1.expect)(insertIndex).toBe(-1 /* last_index */);
    });
});
(0, globals_1.describe)("remove tag hash", () => {
    (0, globals_1.it)("remove tag id hash at end", () => {
        const tagToRemove = 55666;
        const referingTableComponentIds = new Int32Array([1, tagToRemove]);
        const componentsLength = 0;
        const { hash, removeIndex } = (0, hashing_1.computeRemoveTagHash)(referingTableComponentIds, tagToRemove, componentsLength);
        (0, globals_1.expect)(hash).toBe("&.1");
        /* signal that new tag should be added at the end */
        (0, globals_1.expect)(removeIndex).toBe(1);
    });
    (0, globals_1.it)("remove tag id hash with multiple tags", () => {
        const tagToRemove = 777;
        const referingTableComponentIds = new Int32Array([1, 55, tagToRemove, 9906, 40767]);
        const componentsLength = 0;
        const { hash, removeIndex } = (0, hashing_1.computeRemoveTagHash)(referingTableComponentIds, tagToRemove, componentsLength);
        (0, globals_1.expect)(hash).toBe("&.1.55.9906.40767");
        /* signal that new tag should be added at the end */
        (0, globals_1.expect)(removeIndex).toBe(2);
    });
    (0, globals_1.it)("remove tag id hash with multiple tags & components", () => {
        const tagToRemove = 8765;
        const referingTableComponentIds = new Int32Array([1, 55, 100, 432, tagToRemove, 9906, 40767]);
        const componentsLength = 4;
        const { hash, removeIndex } = (0, hashing_1.computeRemoveTagHash)(referingTableComponentIds, tagToRemove, componentsLength);
        (0, globals_1.expect)(hash).toBe(".1.55.100.432&.9906.40767");
        /* signal that new tag should be added at the end */
        (0, globals_1.expect)(removeIndex).toBe(4);
    });
});
(0, globals_1.describe)("additional component hash", () => {
    (0, globals_1.it)("additional tag id hash at end", () => {
        const referingTableComponentIds = new Int32Array([1]);
        const tag = 5600;
        const componentsLength = 1;
        const { hash, insertIndex } = (0, hashing_1.computeAdditonalComponentHash)(referingTableComponentIds, tag, componentsLength);
        (0, globals_1.expect)(hash).toBe(".1.5600&");
        /* signal that new tag should be added at the end */
        (0, globals_1.expect)(insertIndex).toBe(-1 /* last_index */);
    });
    (0, globals_1.it)("additional tag hash generated for multiple pre-existing tags", () => {
        const referingTableComponentIds = new Int32Array([1, 5600]);
        const tag = 55;
        const componentsLength = 2;
        const { hash, insertIndex } = (0, hashing_1.computeAdditonalComponentHash)(referingTableComponentIds, tag, componentsLength);
        (0, globals_1.expect)(hash).toBe(".1.55.5600&");
        (0, globals_1.expect)(insertIndex).toBe(1);
    });
    (0, globals_1.it)("additional tag hash generated for multiple pre-existing components & tags", () => {
        const referingTableComponentIds = new Int32Array([1, 4, 6, 777, 5600]);
        const tag = 9888;
        const componentsLength = 3;
        const { hash, insertIndex } = (0, hashing_1.computeAdditonalComponentHash)(referingTableComponentIds, tag, componentsLength);
        (0, globals_1.expect)(hash).toBe(".1.4.6.9888&.777.5600");
        (0, globals_1.expect)(insertIndex).toBe(-1 /* last_index */);
    });
});
(0, globals_1.describe)("remove component hash", () => {
    (0, globals_1.it)("remove tag id hash at end", () => {
        const tagToRemove = 55666;
        const referingTableComponentIds = new Int32Array([1, tagToRemove]);
        const componentsLength = 2;
        const { hash, removeIndex } = (0, hashing_1.computeRemoveComponentHash)(referingTableComponentIds, tagToRemove, componentsLength);
        (0, globals_1.expect)(hash).toBe(".1&");
        /* signal that new tag should be added at the end */
        (0, globals_1.expect)(removeIndex).toBe(1);
    });
    (0, globals_1.it)("remove tag id hash with multiple tags", () => {
        const tagToRemove = 777;
        const referingTableComponentIds = new Int32Array([1, 55, tagToRemove, 9906, 40767]);
        const componentsLength = 5;
        const { hash, removeIndex } = (0, hashing_1.computeRemoveComponentHash)(referingTableComponentIds, tagToRemove, componentsLength);
        (0, globals_1.expect)(hash).toBe(".1.55.9906.40767&");
        /* signal that new tag should be added at the end */
        (0, globals_1.expect)(removeIndex).toBe(2);
    });
    (0, globals_1.it)("remove tag id hash with multiple tags & components", () => {
        const tagToRemove = 8765;
        const referingTableComponentIds = new Int32Array([1, 55, 100, 432, tagToRemove, 9906, 40767]);
        const componentsLength = 6;
        const { hash, removeIndex } = (0, hashing_1.computeRemoveComponentHash)(referingTableComponentIds, tagToRemove, componentsLength);
        (0, globals_1.expect)(hash).toBe(".1.55.100.432.9906&.40767");
        /* signal that new tag should be added at the end */
        (0, globals_1.expect)(removeIndex).toBe(4);
    });
});
