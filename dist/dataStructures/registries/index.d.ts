import { ComponentDef, ComponentsDeclaration, ComponentClasses } from "../../components/index";
export declare type ComponentRegistry<T extends ComponentsDeclaration> = {
    readonly [key in keyof T]: number | T[key];
};
export declare const MAX_COMPONENTS = 256;
export declare function componentRegistryMacro<T extends ComponentsDeclaration>(declartion: T): ComponentRegistry<T>;
export declare type ComponentDebug<T extends ComponentDef> = {
    definition: T;
    id: number;
    bytesPerElement: number;
    name: string;
};
export declare type ComponentId<T extends ComponentDef> = number | T;
export declare function debugComponent<T extends ComponentDef>(component: ComponentId<T>, componentClasses: ComponentClasses): ComponentDebug<T>;
//# sourceMappingURL=index.d.ts.map