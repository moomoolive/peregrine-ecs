export declare const DATA_TYPES: readonly ["num", "f64", "f32", "u32", "i32", "i16", "u16", "u8", "i8"];
export declare const DATA_TYPES_LISTED: string;
export declare type DefTokens = {
    componentName: string;
    allFields: string[];
    fieldToConstructor: {
        name: string;
        construct: string;
    }[];
    i8: string[];
    u8: string[];
    u16: string[];
    i16: string[];
    u32: string[];
    i32: string[];
    f32: string[];
    f64: string[];
};
export declare function tokenizeComponentDef(name: any, def: any): DefTokens;
//# sourceMappingURL=defValidation.d.ts.map