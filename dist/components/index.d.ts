import { Allocator } from "../allocator/index";
export declare type Types = ("i8" | "u8" | "i16" | "u16" | "i32" | "u32" | "f32" | "f64" | "num");
export declare type i8<Type extends Types> = Type extends "i8" ? Int8Array : never;
export declare type u8<Type extends Types> = Type extends "u8" ? Uint8Array : never;
export declare type i16<Type extends Types> = Type extends "i16" ? Int16Array : never;
export declare type u16<Type extends Types> = Type extends "u16" ? Uint16Array : never;
export declare type i32<Type extends Types> = Type extends "i32" ? Int32Array : never;
export declare type u32<Type extends Types> = Type extends "u32" ? Uint32Array : never;
export declare type f32<Type extends Types> = Type extends "f32" ? Float32Array : never;
export declare type f64<Type extends Types> = Type extends "f64" ? Float64Array : never;
export declare type num<Type extends Types> = Type extends "num" ? Float64Array : never;
export declare type ComponentType<Type extends Types> = (f64<Type> | num<Type> | f32<Type> | i32<Type> | u32<Type> | i16<Type> | u16<Type> | i8<Type> | u8<Type>);
export declare type ComponentDef = {
    readonly [key: string]: Types;
};
export declare type ComponentTypedArray = (Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | Int32Array | Float32Array | Float64Array);
export declare function getComponentSegmentsPtr($allocatorPtrs: Int32Array): number;
export declare type ComponentData<Definition extends ComponentDef> = {
    [key in keyof Definition]: ComponentType<Definition[key]>;
};
export declare type Component<Definition extends ComponentDef> = (ComponentData<Definition>);
export declare type RawComponent<Definition extends ComponentDef> = ({
    data: ComponentData<Definition>;
} & {
    $allocatorPtrs: Int32Array;
    databuffers: ComponentTypedArray[];
});
export declare type ComponentObject<Definition extends ComponentDef> = {
    [key in keyof Definition]: number;
};
export declare type ComponentTokens = ReadonlyArray<{
    name: string;
    type: Types;
    ptrOffset: number;
}>;
export interface ComponentClass<Definition extends ComponentDef> {
    readonly bytesPerElement: number;
    readonly stringifiedDef: string;
    readonly tokens: ComponentTokens;
    proxyClass: {
        new (): ComponentData<Definition>;
    };
    new (initialCapacity: number, globalAllocator: Allocator): RawComponent<Definition>;
}
export declare const enum encoding {
    component_ptr_size = 1
}
export declare function componentMacro<Definition extends ComponentDef>(name: string, def: Definition): ComponentClass<Definition>;
export declare type ComponentsDeclaration = {
    readonly [key: string]: ComponentDef;
};
export declare type ComponentClasses = ReadonlyArray<ComponentClass<ComponentDef>>;
export declare function generateComponentClasses(declaration: ComponentsDeclaration): ComponentClasses;
//# sourceMappingURL=index.d.ts.map