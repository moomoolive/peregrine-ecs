import { ComponentDefinition, ComponentsDeclaration, ComponentViews, ComponentTokens } from "../../components/index";
export declare type ComponentRegistry<Declaration extends ComponentsDeclaration> = {
    readonly [key in keyof Declaration]: number | Declaration[key];
};
export declare const MAX_COMPONENTS = 256;
export declare function componentRegistryMacro<Declartion extends ComponentsDeclaration>(declartion: Declartion): ComponentRegistry<Declartion>;
export declare type ComponentDebug = {
    id: number;
    bytesPerElement: number;
    name: string;
    definition: ComponentTokens;
    stringifiedDef: string;
};
export declare type ComponentId = number | ComponentDefinition;
export declare function debugComponent(component: ComponentId, ComponentViews: ComponentViews): ComponentDebug;
//# sourceMappingURL=index.d.ts.map