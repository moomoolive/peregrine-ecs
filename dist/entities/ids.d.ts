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
//# sourceMappingURL=ids.d.ts.map