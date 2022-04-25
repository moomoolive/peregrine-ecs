import { ComponentDef } from "../../components/index";
export declare type ComponentsDeclaration = {
    readonly [key: string]: ComponentDef;
};
export declare type ComponentRegistry<T extends ComponentsDeclaration> = {
    readonly [key in keyof T]: {
        readonly id: number;
        readonly def: () => T[key];
    };
};
export declare const MAX_COMPONENTS = 256;
export declare function componentRegistryMacro<T extends ComponentsDeclaration>(declartion: T): ComponentRegistry<T>;
//# sourceMappingURL=index.d.ts.map