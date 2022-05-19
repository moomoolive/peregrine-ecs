import {
    relation_entity_encoding,
    entities_encoding
} from "./index"

export const enum id_encoding {
    generation_count_bit_offset = 19,
    base_id_mask = (1 << generation_count_bit_offset) - 1,
    generation_count_bits = 6, 
    /* 63 is the highest generation count before count resets */
    max_generation_count = ((1 << generation_count_bits) - 1),
    generation_count_mask = (
        max_generation_count << generation_count_bit_offset
    ),
}

export function preserveSixBits(num: number): number {
    return num & id_encoding.max_generation_count
}

export function createId(
    baseId: number, 
    generationCount: number
): number {
    const serializedGenerationCount = generationCount << id_encoding.generation_count_bit_offset
    return baseId | serializedGenerationCount 
}

export function extractBaseId(id: number): number {
    return id & id_encoding.base_id_mask
}

export function extractGenerationCount(id: number): number {
    return (id & id_encoding.generation_count_mask) >> id_encoding.generation_count_bit_offset
}

export const enum relationship_encoding {
    relation_mask = relation_entity_encoding.max_id,
    related_entity_mask = (
        ~relation_entity_encoding.relationship_flag
    )
}

export function relationship(
    relation: number,
    entity: number,
): number {
    const relatedTo = entity << relation_entity_encoding.relation_bits
    const id = relation + relatedTo
    return id | relation_entity_encoding.relationship_flag
}

export function isRelationship(relationship: number): boolean {
    return (relationship & relation_entity_encoding.relationship_flag) !== 0
}

export function extractRelation(relationship: number): number {
    return relationship & relationship_encoding.relation_mask
}

export function extractRelatedEntity(
    relationship: number
): number {
    return (relationship & relationship_encoding.related_entity_mask) >> relation_entity_encoding.relation_bits
}