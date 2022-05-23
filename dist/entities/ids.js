"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isComponent = exports.isSized = exports.makeIdSized = exports.isImmutable = exports.makeIdImmutable = exports.extractRelatedEntity = exports.extractRelation = exports.isRelationship = exports.relationship = exports.extractGenerationCount = exports.stripIdMeta = exports.createId = exports.preserveSixBits = void 0;
function preserveSixBits(num) {
    return num & 63 /* max_generation_count */;
}
exports.preserveSixBits = preserveSixBits;
function createId(baseId, generationCount) {
    const serializedGenerationCount = generationCount << 19 /* generation_count_bit_offset */;
    return baseId | serializedGenerationCount;
}
exports.createId = createId;
function stripIdMeta(id) {
    return id & 524287 /* base_id_mask */;
}
exports.stripIdMeta = stripIdMeta;
function extractGenerationCount(id) {
    return (id & 33030144 /* generation_count_mask */) >> 19 /* generation_count_bit_offset */;
}
exports.extractGenerationCount = extractGenerationCount;
function relationship(relation, entity) {
    const relatedTo = entity << 11 /* relation_bits */;
    const id = relation + relatedTo;
    return id | -2147483648 /* relationship_flag */;
}
exports.relationship = relationship;
function isRelationship(relationship) {
    return (relationship & -2147483648 /* relationship_flag */) !== 0;
}
exports.isRelationship = isRelationship;
function extractRelation(relationship) {
    return relationship & 2047 /* relation_mask */;
}
exports.extractRelation = extractRelation;
function extractRelatedEntity(relationship) {
    return (relationship & 2147483647 /* related_entity_mask */) >> 11 /* relation_bits */;
}
exports.extractRelatedEntity = extractRelatedEntity;
function makeIdImmutable(id) {
    return id | 33554432 /* immutable_flag */;
}
exports.makeIdImmutable = makeIdImmutable;
function isImmutable(id) {
    const hasImmutableFlag = (id & 33554432 /* immutable_flag */) !== 0;
    return hasImmutableFlag && !isRelationship(id);
}
exports.isImmutable = isImmutable;
function makeIdSized(id) {
    return id | 67108864 /* sized_flag */;
}
exports.makeIdSized = makeIdSized;
function isSized(id) {
    const hasSizedFlag = (id & 67108864 /* sized_flag */) !== 0;
    return hasSizedFlag && !isRelationship(id);
}
exports.isSized = isSized;
exports.isComponent = isSized;
