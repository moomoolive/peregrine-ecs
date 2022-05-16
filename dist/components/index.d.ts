import { Types, ComponentTypedArrayConstructor, ComponentTokens, ComponentTypedArray } from "./tokenizeDef";
export { Types, ComponentTokens } from "./tokenizeDef";
export declare type i32<Type extends Types> = Type extends "i32" ? Int32Array : never;
export declare type f32<Type extends Types> = Type extends "f32" ? Float32Array : never;
export declare type f64<Type extends Types> = Type extends "f64" ? Float64Array : never;
export declare type num<Type extends Types> = Type extends "num" ? Float64Array : never;
export declare type ComponentType<Type extends Types> = (f64<Type> | num<Type> | f32<Type> | i32<Type>);
export declare type ComponentDefinition = {
    readonly [key: string]: Types;
};
export declare type ComponentGetters<Definition extends ComponentDefinition> = {
    [key in keyof Definition]: (index: number) => number;
};
export declare type ComponentSetters<Definition extends ComponentDefinition> = {
    [key in keyof Definition as `set_${key & string}`]: (index: number, value: number) => void;
};
export declare type ComponentFieldAccessors<Definition extends ComponentDefinition> = (ComponentGetters<Definition> & ComponentSetters<Definition>);
interface DatabufferReference {
    databuffer: ComponentTypedArray;
}
export declare type RawComponentView<Definition extends ComponentDefinition> = (ComponentFieldAccessors<Definition> & {
    "@@self": DatabufferReference;
});
export interface ComponentViewFactory<Definition extends ComponentDefinition> {
    new (self: DatabufferReference): RawComponentView<Definition>;
}
export declare class RawComponent<Definition extends ComponentDefinition> {
    readonly id: number;
    readonly bytesPerElement: number;
    readonly componentSegements: number;
    readonly bytesPerField: number;
    databuffer: ComponentTypedArray;
    memoryConstructor: ComponentTypedArrayConstructor;
    data: RawComponentView<Definition>;
    constructor({ View, bytesPerElement, componentSegements, bytesPerField, memoryConstructor, id }: ComponentViewClass<Definition>, databuffer: ComponentTypedArray);
}
export declare type ComponentObject<Definition extends ComponentDefinition> = {
    [key in keyof Definition]: number;
};
export declare class ComponentViewClass<Definition extends ComponentDefinition> {
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
export declare function componentViewMacro<Definition extends ComponentDefinition>(id: number, name: string, definition: Definition): ComponentViewClass<Definition>;
export declare type ComponentsDeclaration = {
    readonly [key: string]: ComponentDefinition;
};
export declare type ComponentViews = ReadonlyArray<ComponentViewClass<ComponentDefinition>>;
export declare function generateComponentViewClasses(declaration: ComponentsDeclaration): ComponentViews;
//# sourceMappingURL=index.d.ts.map