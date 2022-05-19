"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractRelatedEntity = exports.extractRelation = exports.isRelationship = exports.relationship = exports.extractGenerationCount = exports.extractBaseId = exports.createId = exports.preserveSixBits = void 0;
function preserveSixBits(num) {
    return num & 63 /* max_generation_count */;
}
exports.preserveSixBits = preserveSixBits;
function createId(baseId, generationCount) {
    const serializedGenerationCount = generationCount << 19 /* generation_count_bit_offset */;
    return baseId | serializedGenerationCount;
}
exports.createId = createId;
function extractBaseId(id) {
    return id & 524287 /* base_id_mask */;
}
exports.extractBaseId = extractBaseId;
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
