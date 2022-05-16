export declare const DATA_TYPES: readonly ["num", "f64", "f32", "i32"];
export declare type Types = typeof DATA_TYPES[number];
export declare type ComponentTypedArray = (Int32Array | Float32Array | Float64Array);
export declare type ComponentTypedArrayConstructor = (Float64ArrayConstructor | Float32ArrayConstructor | Int32ArrayConstructor);
export declare type ComponentTokens = {
    componentName: string;
    memoryConstructor: ComponentTypedArrayConstructor;
    memoryType: Types;
    fields: {
        name: string;
        databufferOffset: number;
    }[];
    bytesPerElement: number;
    bytesPerField: (4 | 8);
    componentSegments: number;
    stringifiedDefinition: string;
};
export declare const MAX_FIELDS_PER_COMPONENT = 9;
export declare const enum component_viewer_encoding {
    field_setter_prefix = "set_",
    internal_field_prefix = "@@",
    databuffer_ref = "@@databuffer"
}
export declare function tokenizeComponentDef(name: any, definition: any): ComponentTokens;
//# sourceMappingURL=tokenizeDef.d.ts.map