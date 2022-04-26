import { ComponentDef, ComponentClass } from "../../components/index";
export declare type ComponentsDeclaration = {
    readonly [key: string]: ComponentDef;
};
export declare type ComponentRegistry<T extends ComponentsDeclaration> = {
    readonly [key in keyof T]: number | T[key];
};
export declare const MAX_COMPONENTS = 256;
export declare function componentRegistryMacro<T extends ComponentsDeclaration>(declartion: T): ComponentRegistry<T>;
export declare type ComponentDebug = {
    definition: ComponentDef;
    id: number;
    bytesPerElement: number;
    name: string;
};
export declare function debugComponent(component: number | ComponentDef, componentClasses: ComponentClass<ComponentDef>[]): ComponentDebug;
//# sourceMappingURL=index.d.ts.map