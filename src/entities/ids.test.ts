import {describe, it, expect} from "@jest/globals"
import {
    createId, 
    extractBaseId, 
    extractGenerationCount,
    relationship,
    isRelationship,
    extractRelation,
    extractRelatedEntity
} from "./ids"

describe("should be able to deserialize createId sections", () => {
    it("generated ids should not be the same as base createId, unless generation count is 0", () => {
        const id1 = createId(100_000, 5)
        expect(id1).not.toBe(100_000)
        const id2 = createId(100_000, 0)
        expect(id2).toBe(100_000)
    })

    it("generation count & and base createId should be able to be extracted without corruption", () => {
        const id1 = createId(66_111, 5)
        expect(extractBaseId(id1)).toBe(66_111)
        expect(extractGenerationCount(id1)).toBe(5)
        const id2 = createId(2_345, 0)
        expect(extractBaseId(id2)).toBe(2_345)
        expect(extractGenerationCount(id2)).toBe(0)
        const id3 = createId(5, 23)
        expect(extractBaseId(id3)).toBe(5)
        expect(extractGenerationCount(id3)).toBe(23)
    })

    it("generation count should never be allow to be greater than 63 (6 bits)", () => {
        expect(extractGenerationCount(createId(2, 555))).toBeLessThan(63)
        expect(extractGenerationCount(createId(2, 1_000_000))).toBeLessThan(63)
        expect(extractGenerationCount(createId(2, 64))).toBeLessThan(63)
    })
})

describe("relationship id generation", () => {
    it("relationship id should not be equal to either inputted id", () => {
        const marriedTo = 1
        const fatima = 30_333
        const horribleMarriage = relationship(marriedTo, fatima)
        expect(horribleMarriage).not.toBe(marriedTo)
        expect(horribleMarriage).not.toBe(fatima)
    })

    it("relationships should return true for is relationship function, while non relations should not", () => {
        const marriedTo = 1
        const yumna = 30_333
        const happyMarriage = relationship(marriedTo, yumna)
        expect(isRelationship(happyMarriage)).toBe(true)
        expect(isRelationship(marriedTo)).toBe(false)
        expect(isRelationship(yumna)).toBe(false)
        expect(isRelationship(0)).toBe(false)
        expect(isRelationship(1_000_000)).toBe(false)
        expect(isRelationship(6666)).toBe(false)
    })

    it("relation and entity should be able to be extracted from relation", () => {
        const eats = 2
        const mangos = 45_000
        const eatsMangos = relationship(eats, mangos)
        expect(extractRelation(eatsMangos)).toBe(eats)
        expect(extractRelatedEntity(eatsMangos)).toBe(mangos)
    })
})