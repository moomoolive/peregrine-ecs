"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const tokenizeDef_1 = require("./tokenizeDef");
(0, globals_1.describe)("invalid component def shapes throw error", () => {
    (0, globals_1.it)("should throw with non-object", () => {
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("hi", 0)).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("hi", true)).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("hi", "def")).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("hi", Symbol())).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("hi", undefined)).toThrow();
    });
    (0, globals_1.it)("should throw with objects that do not conform to component def structure", () => {
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("hi", null)).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("hi", [])).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("hi", {})).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("hi", () => { })).toThrow();
    });
});
(0, globals_1.describe)("component naming convention", () => {
    (0, globals_1.it)("should throw if component name is not string or an empty string", () => {
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)(null, { x: "i32" })).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)(undefined, { x: "i32" })).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)({}, { x: "i32" })).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)([], { x: "i32" })).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)(() => { }, { x: "i32" })).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)(1, { x: "i32" })).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)(true, { x: "i32" })).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)(Symbol(), { x: "i32" })).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("", { x: "i32" })).toThrow();
    });
    (0, globals_1.it)("should throw if component name doesn't conform to js variable naming standard (minus unicode)", () => {
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("🥰", { x: "i32" })).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("1component", { x: "i32" })).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("comp@nent", { x: "i32" })).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("comp*nent", { x: "i32" })).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("#component", { x: "i32" })).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("(component)", { x: "i32" })).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("component%", { x: "i32" })).toThrow();
    });
    (0, globals_1.it)("should throw if component name is a reserved ecma keyword", () => {
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("class", { x: "i32" })).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("await", { x: "i32" })).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("true", { x: "i32" })).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("const", { x: "i32" })).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("let", { x: "i32" })).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("throw", { x: "i32" })).toThrow();
    });
});
(0, globals_1.describe)("component field restrictions", () => {
    (0, globals_1.it)("should throw if field name doesn't conform to js variable naming standard (minus unicode)", () => {
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("c", { 0: "i32" })).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("c", { "@comp": "i32" })).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("c", { "#": "i32" })).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("c", { "(field)": "i32" })).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("c", { "field%": "i32" })).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("c", { "*field_generator": "i32" })).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("c", { "🥰": "i32" })).toThrow();
    });
    (0, globals_1.it)("should throw if invalid datatype is inputted", () => {
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("c", { "f": null })).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("c", { "f": 0 })).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("c", { "f": true })).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("c", { "f": {} })).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("c", { "f": [] })).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("c", { "f": Symbol() })).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("c", { "f": () => { } })).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("c", { "f": "random type" })).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("c", { "f": "i64" })).toThrow();
        (0, globals_1.expect)(() => (0, tokenizeDef_1.tokenizeComponentDef)("c", { "f": "mycustomtype" })).toThrow();
    });
});
