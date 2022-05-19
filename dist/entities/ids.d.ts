export declare const enum id_encoding {
    generation_count_bit_offset = 19,
    base_id_mask = 524287,
    generation_count_bits = 6,
    max_generation_count = 63,
    generation_count_mask = 33030144
}
export declare function preserveSixBits(num: number): number;
export declare function createId(baseId: number, generationCount: number): number;
export declare function extractBaseId(id: number): number;
export declare function extractGenerationCount(id: number): number;
export declare const enum relationship_encoding {
    relation_mask = 2047,
    related_entity_mask = 2147483647
}
export declare function relationship(relation: number, entity: number): number;
export declare function isRelationship(relationship: number): boolean;
export declare function extractRelation(relationship: number): number;
export declare function extractRelatedEntity(relationship: number): number;
//# sourceMappingURL=ids.d.ts.map