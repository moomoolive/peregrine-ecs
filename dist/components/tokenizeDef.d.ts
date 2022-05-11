export declare const DATA_TYPES: readonly ["num", "f64", "f32", "u32", "i32", "i16", "u16", "u8", "i8"];
export declare const DATA_TYPES_LISTED: string;
export declare type DefTokens = {
    componentName: string;
    fields: {
        name: string;
        type: (Float64ArrayConstructor | Float32ArrayConstructor | Int32ArrayConstructor | Uint32ArrayConstructor | Uint16ArrayConstructor | Int16ArrayConstructor | Uint16ArrayConstructor | Int8ArrayConstructor | Uint8ArrayConstructor);
    }[];
    elementSize: number;
};
export declare const MAX_FIELDS_PER_COMPONENT = 9;
export declare function tokenizeComponentDef(name: any, def: any): DefTokens;
//# sourceMappingURL=tokenizeDef.d.ts.map