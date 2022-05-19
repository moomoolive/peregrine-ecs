"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractGenerationCount = exports.extractBaseId = exports.createId = exports.preserveSixBits = void 0;
function preserveSixBits(num) {
    return num & 63 /* max_generation_count */;
}
exports.preserveSixBits = preserveSixBits;
/*
export function relation(
    relation: number,
    entity: number,
): number {
    return relationId + relatedEntityId
}
*/
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
