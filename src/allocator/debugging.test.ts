import {expect, describe, it, afterEach} from "@jest/globals"
import {createComponentAllocator} from "./index"
import {componentMacro} from "../components/index"
import {debugComponentPtrs} from "./debugging"

const allocator = createComponentAllocator(1_024, false)

afterEach(() => {
    allocator.freeAll()
})

describe("component pointers debugging", () => {
    it("correct debug information is generated", () => {
        const position = componentMacro("position", {
            x: "f64",
            y: "f64",
            z: "f64"
        })
        const p = new position(5, allocator)
        expect(p.$allocatorPtrs.length).toBe(position.tokens.length)
        const {
            basePointer, 
            fieldPointers
        } = debugComponentPtrs(
            p.$allocatorPtrs,
            position.tokens
        )
        expect(typeof basePointer.rawPtrAddress).toBe("number")
        expect(typeof basePointer.prettyPtrAddress).toBe("string")
        expect(
            basePointer.prettyPtrAddress.includes(basePointer.rawPtrAddress.toString())
        ).toBe(true)
        const addressMap: Map<number, true> = new Map()
        addressMap.set(basePointer.rawPtrAddress, true)
        expect(fieldPointers.length).toBe(3)
        fieldPointers.forEach(({
            rawPtrAddress, 
            prettyPtrAddress,
            type,
            name
        }, index) => {
            /* each component segment has a unique address, that doesn't conflict with base pointer */
            expect(addressMap.get(rawPtrAddress)).toBe(undefined)
            addressMap.set(rawPtrAddress, true)
            expect(
                prettyPtrAddress.includes(rawPtrAddress.toString())
            ).toBe(true)
            if (index === 0) {
                expect(type).toBe("f64")
                expect(name).toBe("x")
            } else if (index === 1) {
                expect(type).toBe("f64")
                expect(name).toBe("y")
            } else if (index === 2) {
                expect(type).toBe("f64")
                expect(name).toBe("z")
            }  
        })
    })


    it("correct debug information is generated", () => {
        const animation = componentMacro("animation", {
            position: "i32",
            face: "i8"
        })
        const p = new animation(5, allocator)
        expect(p.$allocatorPtrs.length).toBe(animation.tokens.length)
        const {
            basePointer, 
            fieldPointers
        } = debugComponentPtrs(
            p.$allocatorPtrs,
            animation.tokens
        )
        expect(typeof basePointer.rawPtrAddress).toBe("number")
        expect(typeof basePointer.prettyPtrAddress).toBe("string")
        expect(
            basePointer.prettyPtrAddress.includes(basePointer.rawPtrAddress.toString())
        ).toBe(true)
        const addressMap: Map<number, true> = new Map()
        addressMap.set(basePointer.rawPtrAddress, true)
        expect(fieldPointers.length).toBe(2)
        fieldPointers.forEach(({
            rawPtrAddress, 
            prettyPtrAddress,
            type,
            name
        }, index) => {
            /* each component segment has a unique address, that doesn't conflict with base pointer */
            expect(addressMap.get(rawPtrAddress)).toBe(undefined)
            addressMap.set(rawPtrAddress, true)
            expect(
                prettyPtrAddress.includes(rawPtrAddress.toString())
            ).toBe(true)
            if (index === 0) {
                expect(type).toBe("i32")
                expect(name).toBe("position")
            } else if (index === 1) {
                expect(type).toBe("i8")
                expect(name).toBe("face")
            }
        })
    })
})