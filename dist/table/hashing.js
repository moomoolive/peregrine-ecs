"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeAdditonalComponentHash = exports.computeRemoveTagHash = exports.computeAdditonalTagHash = exports.generateTableHash = void 0;
function hashComponent(componentId) {
    return "." /* component_separator */ + componentId.toString();
}
function generateTableHash(componentIds, numberOfComponents) {
    let hash = "";
    for (let i = 0; i < numberOfComponents; i++) {
        hash += hashComponent(componentIds[i]);
    }
    hash += "&" /* tag_component_divider */;
    for (let i = numberOfComponents; i < componentIds.length; i++) {
        hash += hashComponent(componentIds[i]);
    }
    return hash;
}
exports.generateTableHash = generateTableHash;
function computeComponentHashSection(referingTableComponentIds, componentsLength) {
    let hash = "";
    /* compute section for components */
    for (let i = 0; i < componentsLength; i++) {
        hash += hashComponent(referingTableComponentIds[i]);
    }
    return hash + "&" /* tag_component_divider */;
}
const additionHash = { hash: "", insertIndex: 0 };
function computeAdditonalTagHash(referingTableComponentIds, additionalTag, componentsLength) {
    /* compute section for components */
    let hash = computeComponentHashSection(referingTableComponentIds, componentsLength);
    /* compute section for tags */
    let insertIndex = -1 /* last_index */;
    const len = referingTableComponentIds.length - 1;
    const start = componentsLength - 1;
    for (let i = start; i < len; i++) {
        const nextTag = referingTableComponentIds[i + 1];
        if (nextTag > additionalTag) {
            hash += hashComponent(additionalTag);
            insertIndex = i + 1;
        }
        hash += hashComponent(nextTag);
    }
    /*
    if none of the tags where bigger than input tag, it means
    that input tag is the biggest tag now
    */
    if (insertIndex === -1 /* last_index */) {
        hash += hashComponent(additionalTag);
    }
    additionHash.hash = hash;
    additionHash.insertIndex = insertIndex;
    return additionHash;
}
exports.computeAdditonalTagHash = computeAdditonalTagHash;
const removeHash = { hash: "", removeIndex: 0 };
function computeRemoveTagHash(referingTableComponentIds, removeTag, componentsLength) {
    /* compute section for components */
    let hash = computeComponentHashSection(referingTableComponentIds, componentsLength);
    /* compute section for tags */
    let removeIndex = 0;
    const start = componentsLength;
    const len = referingTableComponentIds.length;
    for (let i = start; i < len; i++) {
        const tag = referingTableComponentIds[i];
        if (tag === removeTag) {
            removeIndex = i;
            continue;
        }
        hash += hashComponent(tag);
    }
    removeHash.hash = hash;
    removeHash.removeIndex = removeIndex;
    return removeHash;
}
exports.computeRemoveTagHash = computeRemoveTagHash;
function computeTagsHashSection(referingTableComponentIds, componentsLength) {
    let hash = "";
    /* compute section for components */
    const len = referingTableComponentIds.length;
    for (let i = componentsLength; i < len; i++) {
        hash += hashComponent(referingTableComponentIds[i]);
    }
    return hash;
}
function computeAdditonalComponentHash(referingTableComponentIds, componentId, componentsLength) {
    /* compute section for components */
    let hash = "";
    let insertIndex = -1 /* last_index */;
    const start = 0;
    const len = componentsLength;
    for (let i = start; i < len; i++) {
        const nextTag = referingTableComponentIds[i];
        if (nextTag > componentId) {
            hash += hashComponent(componentId);
            insertIndex = i;
        }
        hash += hashComponent(nextTag);
    }
    /*
    if none of the tags where bigger than input componentId,
    it means that input id tag the biggest tag now
    */
    if (insertIndex === -1 /* last_index */) {
        hash += hashComponent(componentId);
    }
    hash += "&" /* tag_component_divider */;
    /* compute section for tags */
    hash += computeTagsHashSection(referingTableComponentIds, componentsLength);
    additionHash.hash = hash;
    additionHash.insertIndex = insertIndex;
    return additionHash;
}
exports.computeAdditonalComponentHash = computeAdditonalComponentHash;
