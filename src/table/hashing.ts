export const enum table_hashes {
    tag_component_divider = "&",
    non_standard_hash_prefix = "*",
    component_separator = ".",
    last_index = -1
}

function hashComponent(componentId: number): string {
    return table_hashes.component_separator + componentId.toString()
}

export function generateTableHash(
    componentIds: Int32Array,
    numberOfComponents: number
): string {
    let hash = ""
    for (let i = 0; i < numberOfComponents; i++) {
        hash += hashComponent(componentIds[i])
    }
    hash += table_hashes.tag_component_divider
    for (let i = numberOfComponents; i < componentIds.length; i++) {
        hash += hashComponent(componentIds[i])
    }
    return hash
}

function computeComponentHashSection(
    referingTableComponentIds: Int32Array,
    componentsLength: number
): string {
    let hash = ""
    /* compute section for components */
    for (let i = 0; i < componentsLength; i++) {
        hash += hashComponent(referingTableComponentIds[i])
    }
    return hash + table_hashes.tag_component_divider
}

const additionHash = {hash: "", insertIndex: 0} 
export function computeAdditonalTagHash(
    referingTableComponentIds: Int32Array,
    additionalTag: number,
    componentsLength: number
): {hash: string, insertIndex: number} {
    /* compute section for components */
    let hash = computeComponentHashSection(
        referingTableComponentIds,
        componentsLength
    )
    /* compute section for tags */
    let insertIndex = table_hashes.last_index
    const len = referingTableComponentIds.length - 1
    const start = componentsLength - 1
    for (let i = start; i < len; i++) {
        const nextTag = referingTableComponentIds[i + 1]
        if (nextTag > additionalTag) {
            hash += hashComponent(additionalTag)
            insertIndex = i + 1
        }
        hash += hashComponent(nextTag)
    }
    /* 
    if none of the tags where bigger than input tag, it means
    that input tag is the biggest tag now 
    */
    if (insertIndex === table_hashes.last_index) {
        hash += hashComponent(additionalTag)
    }
    additionHash.hash = hash
    additionHash.insertIndex = insertIndex
    return additionHash
}

const removeHash = {hash: "", removeIndex: 0}
export function computeRemoveTagHash(
    referingTableComponentIds: Int32Array,
    removeTag: number,
    componentsLength: number
): {hash: string, removeIndex: number} {
    /* compute section for components */
    let hash = computeComponentHashSection(
        referingTableComponentIds,
        componentsLength
    )
    /* compute section for tags */
    let removeIndex = 0
    const start = componentsLength
    const len = referingTableComponentIds.length
    for (let i = start; i < len; i++) {
        const tag = referingTableComponentIds[i]
        if (tag === removeTag) {
            removeIndex = i
            continue
        }
        hash += hashComponent(tag)
    }
    removeHash.hash = hash
    removeHash.removeIndex = removeIndex
    return removeHash
}

function computeTagsHashSection(
    referingTableComponentIds: Int32Array,
    componentsLength: number
): string {
    let hash = ""
    /* compute section for components */
    const len = referingTableComponentIds.length
    for (let i = componentsLength; i < len; i++) {
        hash += hashComponent(referingTableComponentIds[i])
    }
    return hash
}

export function computeAdditonalComponentHash(
    referingTableComponentIds: Int32Array,
    componentId: number,
    componentsLength: number
): {hash: string, insertIndex: number} {
    /* compute section for components */
    let hash = ""
    let insertIndex = table_hashes.last_index
    const start = 0
    const len = componentsLength
    for (let i = start; i < len; i++) {
        const nextTag = referingTableComponentIds[i]
        if (nextTag > componentId) {
            hash += hashComponent(componentId)
            insertIndex = i
        }
        hash += hashComponent(nextTag)
    }
    /* 
    if none of the tags where bigger than input componentId, 
    it means that input id tag the biggest tag now 
    */
    if (insertIndex === table_hashes.last_index) {
        hash += hashComponent(componentId)
    }

    hash += table_hashes.tag_component_divider

    /* compute section for tags */
    hash += computeTagsHashSection(
        referingTableComponentIds,
        componentsLength
    )
    additionHash.hash = hash
    additionHash.insertIndex = insertIndex
    return additionHash
}