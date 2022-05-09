"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const index_1 = require("./index");
(0, globals_1.describe)("adding/removing elements", () => {
    (0, globals_1.it)("can add elements", () => {
        const v = new index_1.Veci32(5);
        index_1.Veci32.push(v, 2);
        (0, globals_1.expect)(v.memory[0]).toBe(2);
        (0, globals_1.expect)(v.length).toBe(1);
        index_1.Veci32.push(v, -2);
        (0, globals_1.expect)(v.memory[1]).toBe(-2);
        (0, globals_1.expect)(v.length).toBe(2);
    });
    (0, globals_1.it)("resizes when capacity is met", () => {
        const v = new index_1.Veci32(1);
        (0, globals_1.expect)(v.memory.length).toBe(1);
        index_1.Veci32.push(v, 2);
        (0, globals_1.expect)(v.memory[0]).toBe(2);
        (0, globals_1.expect)(v.length).toBe(1);
        index_1.Veci32.push(v, -2);
        (0, globals_1.expect)(v.memory[0]).toBe(2);
        (0, globals_1.expect)(v.memory[1]).toBe(-2);
        (0, globals_1.expect)(v.length).toBe(2);
        (0, globals_1.expect)(v.memory.length).toBeGreaterThan(1);
    });
    (0, globals_1.it)("elements can be removed", () => {
        const v = new index_1.Veci32(5);
        index_1.Veci32.push(v, 2);
        index_1.Veci32.push(v, -2);
        (0, globals_1.expect)(v.length).toBe(2);
        (0, globals_1.expect)(index_1.Veci32.pop(v)).toBe(-2);
        (0, globals_1.expect)(v.length).toBe(1);
        (0, globals_1.expect)(index_1.Veci32.pop(v)).toBe(2);
        (0, globals_1.expect)(v.length).toBe(0);
        (0, globals_1.expect)(index_1.Veci32.pop(v)).toBe(undefined);
        (0, globals_1.expect)(v.length).toBe(0);
        (0, globals_1.expect)(index_1.Veci32.pop(v)).toBe(undefined);
        (0, globals_1.expect)(v.length).toBe(0);
    });
    (0, globals_1.it)("capacity should shrink if too much memory is unused", () => {
        const v = new index_1.Veci32(5000);
        index_1.Veci32.push(v, 2);
        (0, globals_1.expect)(v.memory.length).toBe(5000);
        index_1.Veci32.pop(v);
        (0, globals_1.expect)(v.memory.length).toBeLessThan(5000);
    });
});
(0, globals_1.describe)("expanding/shrinking capacity", () => {
    (0, globals_1.it)("reserve adds the given amount of memory to vec", () => {
        const v = new index_1.Veci32(1);
        index_1.Veci32.reserve(v, 10);
        (0, globals_1.expect)(v.memory.length).toBe(10);
        (0, globals_1.expect)(v.length).toBe(0);
        /* does nothing if capacity is as much as requested */
        index_1.Veci32.reserve(v, 10);
        (0, globals_1.expect)(v.memory.length).toBe(10);
        (0, globals_1.expect)(v.length).toBe(0);
        index_1.Veci32.reserve(v, 5);
        (0, globals_1.expect)(v.memory.length).toBe(10);
        (0, globals_1.expect)(v.length).toBe(0);
    });
    (0, globals_1.it)("shrinkTo shrinks vec capacity to given amount", () => {
        const v = new index_1.Veci32(5);
        index_1.Veci32.push(v, 2);
        index_1.Veci32.push(v, -2);
        index_1.Veci32.shrinkTo(v, 2);
        (0, globals_1.expect)(v.memory.length).toBe(4);
        (0, globals_1.expect)(v.length).toBe(2);
        index_1.Veci32.shrinkTo(v, 0);
        (0, globals_1.expect)(v.memory.length).toBe(2);
        (0, globals_1.expect)(v.length).toBe(2);
        /* negative min capacity does nothing */
        index_1.Veci32.shrinkTo(v, -10);
        (0, globals_1.expect)(v.memory.length).toBe(2);
        (0, globals_1.expect)(v.length).toBe(2);
    });
});
