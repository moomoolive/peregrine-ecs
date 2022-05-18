import { ComponentsDeclaration } from "../../components/index";
export declare type ComponentRegistry<Declaration extends ComponentsDeclaration> = {
    readonly [key in keyof Declaration]: number | Declaration[key];
};
export declare const enum registry_encoding {
    max_components = 256
}
export declare function componentRegistryMacro<Declartion extends ComponentsDeclaration>(componentNames: string[]): ComponentRegistry<Declartion>;
//# sourceMappingURL=index.d.ts.map