import {describe, it, expect} from "@jest/globals"
import {
    computeAdditonalTagHash,
    table_hashes,
    computeRemoveTagHash
} from "./index"

describe("additional tag hash", () => {
    it("additional tag id hash at end", () => {
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

describe("remove tag hash", () => {
    it("remove tag id hash at end", () => {
        const tagToRemove = 55_666
        const referingTableComponentIds = new Int32Array(
            [1, tagToRemove]
        )
        const componentsLength = 0
        const {hash, removeIndex} = computeRemoveTagHash(
            referingTableComponentIds,
            tagToRemove,
            componentsLength
        )
        expect(hash).toBe("&.1")
        /* signal that new tag should be added at the end */
        expect(removeIndex).toBe(1)
    })

    it("remove tag id hash with multiple tags", () => {
        const tagToRemove = 777
        const referingTableComponentIds = new Int32Array(
            [1, 55, tagToRemove, 9_906, 40_767]
        )
        const componentsLength = 0
        const {hash, removeIndex} = computeRemoveTagHash(
            referingTableComponentIds,
            tagToRemove,
            componentsLength
        )
        expect(hash).toBe("&.1.55.9906.40767")
        /* signal that new tag should be added at the end */
        expect(removeIndex).toBe(2)
    })

    it("remove tag id hash with multiple tags & components", () => {
        const tagToRemove = 8_765
        const referingTableComponentIds = new Int32Array(
            [1, 55, 100, 432, tagToRemove, 9_906, 40_767]
        )
        const componentsLength = 4
        const {hash, removeIndex} = computeRemoveTagHash(
            referingTableComponentIds,
            tagToRemove,
            componentsLength
        )
        expect(hash).toBe(".1.55.100.432&.9906.40767")
        /* signal that new tag should be added at the end */
        expect(removeIndex).toBe(4)
    })
})