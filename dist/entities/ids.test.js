"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const ids_1 = require("./ids");
(0, globals_1.describe)("should be able to deserialize createId sections", () => {
    (0, globals_1.it)("generated ids should not be the same as base createId, unless generation count is 0", () => {
        const id1 = (0, ids_1.createId)(100000, 5);
        (0, globals_1.expect)(id1).not.toBe(100000);
        const id2 = (0, ids_1.createId)(100000, 0);
        (0, globals_1.expect)(id2).toBe(100000);
    });
    (0, globals_1.it)("generation count & and base createId should be able to be extracted without corruption", () => {
        const id1 = (0, ids_1.createId)(66111, 5);
        (0, globals_1.expect)((0, ids_1.extractBaseId)(id1)).toBe(66111);
        (0, globals_1.expect)((0, ids_1.extractGenerationCount)(id1)).toBe(5);
        const id2 = (0, ids_1.createId)(2345, 0);
        (0, globals_1.expect)((0, ids_1.extractBaseId)(id2)).toBe(2345);
        (0, globals_1.expect)((0, ids_1.extractGenerationCount)(id2)).toBe(0);
        const id3 = (0, ids_1.createId)(5, 23);
        (0, globals_1.expect)((0, ids_1.extractBaseId)(id3)).toBe(5);
        (0, globals_1.expect)((0, ids_1.extractGenerationCount)(id3)).toBe(23);
    });
    (0, globals_1.it)("generation count should never be allow to be greater than 63 (6 bits)", () => {
        (0, globals_1.expect)((0, ids_1.extractGenerationCount)((0, ids_1.createId)(2, 555))).toBeLessThan(63);
        (0, globals_1.expect)((0, ids_1.extractGenerationCount)((0, ids_1.createId)(2, 1000000))).toBeLessThan(63);
        (0, globals_1.expect)((0, ids_1.extractGenerationCount)((0, ids_1.createId)(2, 64))).toBeLessThan(63);
    });
});
