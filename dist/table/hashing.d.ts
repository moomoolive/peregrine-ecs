export declare const enum table_hashes {
    tag_component_divider = "&",
    non_standard_hash_prefix = "*",
    component_separator = ".",
    last_index = -1
}
export declare function generateTableHash(componentIds: Int32Array, numberOfComponents: number): string;
export declare function computeAdditonalTagHash(referingTableComponentIds: Int32Array, additionalTag: number, componentsLength: number): {
    hash: string;
    insertIndex: number;
};
export declare function computeRemoveTagHash(referingTableComponentIds: Int32Array, removeTag: number, componentsLength: number): {
    hash: string;
    removeIndex: number;
};
export declare function computeAdditonalComponentHash(referingTableComponentIds: Int32Array, componentId: number, componentsLength: number): {
    hash: string;
    insertIndex: number;
};
export declare function computeRemoveComponentHash(referingTableComponentIds: Int32Array, removeComponentId: number, componentsLength: number): {
    hash: string;
    removeIndex: number;
};
//# sourceMappingURL=hashing.d.ts.map