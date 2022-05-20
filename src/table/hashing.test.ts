import {describe, it, expect} from "@jest/globals"
import {
    computeAdditonalTagHash,
    table_hashes
} from "./index"

describe("table hashing", () => {
    it("additional tag id hash", () => {
        const referingTableComponentIds = new Int32Array([1])
        const tag = 5_600
        const componentsLength = 0
        const {hash, insertIndex} = computeAdditonalTagHash(
            referingTableComponentIds,
            tag,
            componentsLength
        )
        expect(hash).toBe("&.1.5600")
        /* signal that new tag should be added at the end */
        expect(insertIndex).toBe(table_hashes.last_index)
    })

    it("additional tag hash generated for multiple pre-existing tags", () => {
        const referingTableComponentIds = new Int32Array([1, 5_600])
        const tag = 55
        const componentsLength = 0
        const {hash, insertIndex} = computeAdditonalTagHash(
            referingTableComponentIds,
            tag,
            componentsLength
        )
        expect(hash).toBe("&.1.55.5600")
        expect(insertIndex).toBe(1)
    })

    it("additional tag hash generated for multiple pre-existing components & tags", () => {
        const referingTableComponentIds = new Int32Array(
            [1, 4, 6, 777, 5_600]
        )
        const tag = 9_888
        const componentsLength = 3
        const {hash, insertIndex} = computeAdditonalTagHash(
            referingTableComponentIds,
            tag,
            componentsLength
        )
        expect(hash).toBe(".1.4.6&.777.5600.9888")
        expect(insertIndex).toBe(table_hashes.last_index)
    })
})