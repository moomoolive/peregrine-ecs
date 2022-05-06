export declare type Types = ("i8" | "u8" | "i16" | "u16" | "i32" | "u32" | "f32" | "f64" | "num");
export declare type i8<T extends Types> = T extends "i8" ? Int8Array : never;
export declare type u8<T extends Types> = T extends "u8" ? Uint8Array : never;
export declare type i16<T extends Types> = T extends "i16" ? Int16Array : never;
export declare type u16<T extends Types> = T extends "u16" ? Uint16Array : never;
export declare type i32<T extends Types> = T extends "i32" ? Int32Array : never;
export declare type u32<T extends Types> = T extends "u32" ? Uint32Array : never;
export declare type f32<T extends Types> = T extends "f32" ? Float32Array : never;
export declare type f64<T extends Types> = T extends "f64" ? Float64Array : never;
export declare type num<T extends Types> = T extends "num" ? Float64Array : never;
export declare type ComponentType<T extends Types> = (f64<T> | num<T> | f32<T> | i32<T> | u32<T> | i16<T> | u16<T> | i8<T> | u8<T>);
export declare type ComponentDef = {
    readonly [key: string]: Types;
};
export declare type Component<T extends ComponentDef> = {
    [key in keyof T]: ComponentType<T[key]>;
};
export declare type ComponentObject<T extends ComponentDef> = {
    [key in keyof T]: number;
};
export interface ComponentClass<T extends ComponentDef> {
    readonly bytesPerElement: number;
    readonly name: string;
    def: () => T;
    new: (initialCapacity: number) => Component<T>;
    push: (component: Component<T>, obj: ComponentObject<T>, length: number) => number;
    pop: (component: Component<T>, length: number) => number;
    consume: (consumer: Component<T>, consumed: Component<T>, targetIndex: number) => void;
}
export declare function componentMacro<T extends ComponentDef>(name: string, def: T): ComponentClass<T>;
export declare type ComponentsDeclaration = {
    readonly [key: string]: ComponentDef;
};
export declare type ComponentClasses = ReadonlyArray<ComponentClass<ComponentDef>>;
export declare function generateComponentClasses(declaration: ComponentsDeclaration): ComponentClasses;
//# sourceMappingURL=index.d.ts.map