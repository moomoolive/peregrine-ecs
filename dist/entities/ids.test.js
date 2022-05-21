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
        (0, globals_1.expect)((0, ids_1.stripIdMeta)(id1)).toBe(66111);
        (0, globals_1.expect)((0, ids_1.extractGenerationCount)(id1)).toBe(5);
        const id2 = (0, ids_1.createId)(2345, 0);
        (0, globals_1.expect)((0, ids_1.stripIdMeta)(id2)).toBe(2345);
        (0, globals_1.expect)((0, ids_1.extractGenerationCount)(id2)).toBe(0);
        const id3 = (0, ids_1.createId)(5, 23);
        (0, globals_1.expect)((0, ids_1.stripIdMeta)(id3)).toBe(5);
        (0, globals_1.expect)((0, ids_1.extractGenerationCount)(id3)).toBe(23);
    });
    (0, globals_1.it)("generation count should never be allow to be greater than 63 (6 bits)", () => {
        (0, globals_1.expect)((0, ids_1.extractGenerationCount)((0, ids_1.createId)(2, 555))).toBeLessThan(63);
        (0, globals_1.expect)((0, ids_1.extractGenerationCount)((0, ids_1.createId)(2, 1000000))).toBeLessThan(63);
        (0, globals_1.expect)((0, ids_1.extractGenerationCount)((0, ids_1.createId)(2, 64))).toBeLessThan(63);
    });
});
(0, globals_1.describe)("relationship id generation", () => {
    (0, globals_1.it)("relationship id should not be equal to either inputted id", () => {
        const marriedTo = 1;
        const fatima = 30333;
        const horribleMarriage = (0, ids_1.relationship)(marriedTo, fatima);
        (0, globals_1.expect)(horribleMarriage).not.toBe(marriedTo);
        (0, globals_1.expect)(horribleMarriage).not.toBe(fatima);
    });
    (0, globals_1.it)("relationships should return true for is relationship function, while non relations should not", () => {
        const marriedTo = 1;
        const yumna = 30333;
        const happyMarriage = (0, ids_1.relationship)(marriedTo, yumna);
        (0, globals_1.expect)((0, ids_1.isRelationship)(happyMarriage)).toBe(true);
        (0, globals_1.expect)((0, ids_1.isRelationship)(marriedTo)).toBe(false);
        (0, globals_1.expect)((0, ids_1.isRelationship)(yumna)).toBe(false);
        (0, globals_1.expect)((0, ids_1.isRelationship)(0)).toBe(false);
        (0, globals_1.expect)((0, ids_1.isRelationship)(1000000)).toBe(false);
        (0, globals_1.expect)((0, ids_1.isRelationship)(6666)).toBe(false);
    });
    (0, globals_1.it)("relation and entity should be able to be extracted from relation", () => {
        const eats = 2;
        const mangos = 45000;
        const eatsMangos = (0, ids_1.relationship)(eats, mangos);
        (0, globals_1.expect)((0, ids_1.extractRelation)(eatsMangos)).toBe(eats);
        (0, globals_1.expect)((0, ids_1.extractRelatedEntity)(eatsMangos)).toBe(mangos);
    });
});
(0, globals_1.describe)("immutability", () => {
    (0, globals_1.it)("can make id immutable", () => {
        const id = 0;
        const immutableId = (0, ids_1.makeIdImmutable)(id);
        (0, globals_1.expect)((0, ids_1.isImmutable)(immutableId)).toBe(true);
    });
    (0, globals_1.it)("relationships cannot be immutable", () => {
        const eats = 2;
        const mangos = 45000;
        const eatsMangos = (0, ids_1.relationship)(eats, mangos);
        const immutableEatsMangos = (0, ids_1.makeIdImmutable)(eatsMangos);
        (0, globals_1.expect)((0, ids_1.isImmutable)(immutableEatsMangos)).toBe(false);
    });
});
