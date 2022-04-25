import {expect, describe, it} from "@jest/globals"
import {tokenizeComponentDef} from "./defValidation"

describe("invalid component def shapes throw error", () => {
    it("should throw with non-object", () => {
        expect(() => tokenizeComponentDef("hi", 0)).toThrow()
        expect(() => tokenizeComponentDef("hi", true)).toThrow()
        expect(() => tokenizeComponentDef("hi", "def")).toThrow()
        expect(() => tokenizeComponentDef("hi", Symbol())).toThrow()
        expect(() => tokenizeComponentDef("hi", undefined)).toThrow()
    })

    it("should throw with objects that do not conform to component def structure", () => {
        expect(() => tokenizeComponentDef("hi", null)).toThrow()
        expect(() => tokenizeComponentDef("hi", [])).toThrow()
        expect(() => tokenizeComponentDef("hi", {})).toThrow()
        expect(() => tokenizeComponentDef("hi", () => {})).toThrow()
    })
})

describe("component naming convention", () => {
    it("should throw if component name is not string or an empty string", () => {
        expect(() => tokenizeComponentDef(null, {x: "i32"})).toThrow()
        expect(() => tokenizeComponentDef(undefined, {x: "i32"})).toThrow()
        expect(() => tokenizeComponentDef({}, {x: "i32"})).toThrow()
        expect(() => tokenizeComponentDef([], {x: "i32"})).toThrow()
        expect(() => tokenizeComponentDef(() => {}, {x: "i32"})).toThrow()
        expect(() => tokenizeComponentDef(1, {x: "i32"})).toThrow()
        expect(() => tokenizeComponentDef(true, {x: "i32"})).toThrow()
        expect(() => tokenizeComponentDef(Symbol(), {x: "i32"})).toThrow()
        expect(() => tokenizeComponentDef("", {x: "i32"})).toThrow()
    })

    it("should throw if component name doesn't conform to js variable naming standard (minus unicode)", () => {
        expect(() => tokenizeComponentDef("🥰", {x: "i32"})).toThrow()
        expect(() => tokenizeComponentDef("1component", {x: "i32"})).toThrow()
        expect(() => tokenizeComponentDef("comp@nent", {x: "i32"})).toThrow()
        expect(() => tokenizeComponentDef("comp*nent", {x: "i32"})).toThrow()
        expect(() => tokenizeComponentDef("#component", {x: "i32"})).toThrow()
        expect(() => tokenizeComponentDef("(component)", {x: "i32"})).toThrow()
        expect(() => tokenizeComponentDef("component%", {x: "i32"})).toThrow()
    })
})

describe("component field restrictions", () => {
    it("should throw if field name doesn't conform to js variable naming standard (minus unicode)", () => {
        expect(() => tokenizeComponentDef("c", {0: "i32"})).toThrow()
        expect(() => tokenizeComponentDef("c", {"@comp": "i32"})).toThrow()
        expect(() => tokenizeComponentDef("c", {"#": "i32"})).toThrow()
        expect(() => tokenizeComponentDef("c", {"(field)": "i32"})).toThrow()
        expect(() => tokenizeComponentDef("c", {"field%": "i32"})).toThrow()
        expect(() => tokenizeComponentDef("c", {"*field_generator": "i32"})).toThrow()
        expect(() => tokenizeComponentDef("c", {"🥰": "i32"})).toThrow()
    })

    it("should throw if invalid datatype is inputted", () => {
        expect(() => tokenizeComponentDef("c", {"f": null})).toThrow()
        expect(() => tokenizeComponentDef("c", {"f": 0})).toThrow()
        expect(() => tokenizeComponentDef("c", {"f": true})).toThrow()
        expect(() => tokenizeComponentDef("c", {"f": {}})).toThrow()
        expect(() => tokenizeComponentDef("c", {"f": []})).toThrow()
        expect(() => tokenizeComponentDef("c", {"f": Symbol()})).toThrow()
        expect(() => tokenizeComponentDef("c", {"f": () => {}})).toThrow()
        expect(() => tokenizeComponentDef("c", {"f": "random type"})).toThrow()
        expect(() => tokenizeComponentDef("c", {"f": "i64"})).toThrow()
        expect(() => tokenizeComponentDef("c", {"f": "mycustomtype"})).toThrow()
    })
})