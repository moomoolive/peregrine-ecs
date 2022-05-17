import { Types, ComponentTypedArrayConstructor, ComponentTokens, ComponentTypedArray } from "./tokenizeDef";
export type { Types, ComponentTokens } from "./tokenizeDef";
export { MAX_FIELDS_PER_COMPONENT } from "./tokenizeDef";
export declare type i32<Type extends Types> = Type extends "i32" ? Int32Array : never;
export declare type f32<Type extends Types> = Type extends "f32" ? Float32Array : never;
export declare type f64<Type extends Types> = Type extends "f64" ? Float64Array : never;
export declare type num<Type extends Types> = Type extends "num" ? Float64Array : never;
export declare type ComponentType<Type extends Types> = (f64<Type> | num<Type> | f32<Type> | i32<Type>);
export declare type ComponentDefinition = {
    readonly [key: string]: Types;
};
export declare type StructProxy<Definition extends ComponentDefinition> = {
    [key in keyof Definition]: number;
};
interface ComponentReference {
    databuffer: ComponentTypedArray;
}
export declare type RawStructProxy<Definition extends ComponentDefinition> = (StructProxy<Definition> & {
    "@@component": ComponentReference;
    "@@offset": number;
});
export interface ComponentViewFactory<Definition extends ComponentDefinition> {
    new (component: ComponentReference, offset: number): RawStructProxy<Definition>;
}
export declare class RawComponent<Definition extends ComponentDefinition> {
    readonly id: number;
    readonly bytesPerElement: number;
    readonly componentSegements: number;
    readonly bytesPerField: number;
    databuffer: ComponentTypedArray;
    memoryConstructor: ComponentTypedArrayConstructor;
    structProxyFactory: ComponentViewFactory<Definition>;
    constructor({ View, bytesPerElement, componentSegements, bytesPerField, memoryConstructor, id }: StructProxyClass<Definition>, databuffer: ComponentTypedArray);
    index(index: number): StructProxy<Definition>;
}
export declare class StructProxyClass<Definition extends ComponentDefinition> {
    readonly bytesPerElement: number;
    readonly stringifiedDefinition: string;
    readonly tokens: ComponentTokens;
    readonly name: string;
    readonly componentSegements: number;
    readonly bytesPerField: number;
    readonly id: number;
    memoryConstructor: ComponentTypedArrayConstructor;
    View: ComponentViewFactory<Definition>;
    constructor(id: number, tokens: ComponentTokens, View: ComponentViewFactory<Definition>);
}
export declare function structProxyMacro<Definition extends ComponentDefinition>(id: number, name: string, definition: Definition): StructProxyClass<Definition>;
export declare type ComponentsDeclaration = {
    readonly [key: string]: ComponentDefinition;
};
export declare type StructProxyClasses = ReadonlyArray<StructProxyClass<ComponentDefinition>>;
export declare function generateComponentStructProxies(declaration: ComponentsDeclaration): StructProxyClasses;
//# sourceMappingURL=index.d.ts.map