import { ComponentsDeclaration } from "../../components/index";
export declare type ComponentRegistry<Declaration extends ComponentsDeclaration> = {
    readonly [key in keyof Declaration]: number | Declaration[key];
};
export declare const enum registry_encoding {
    max_components = 256
}
export declare function componentRegistryMacro<Declartion extends ComponentsDeclaration>(componentNames: string[]): ComponentRegistry<Declartion>;
export declare type IdDeclaration = ReadonlyArray<string>;
export declare function computeRelationId(offset: number): number;
declare const STANDARD_RELATIONS: readonly ["instanceof"];
export declare const enum relation_registy_encoding {
    standard_relations_count = 1
}
export declare type RelationRegisty<Declaration extends IdDeclaration> = ({
    readonly [key in Declaration[number]]: number;
} & {
    readonly [key in typeof STANDARD_RELATIONS[number]]: number;
});
export declare function relationRegistryMacro<Declaration extends IdDeclaration>(relationNames: Declaration): {
    relations: RelationRegisty<Declaration>;
    orderedKeys: string[];
};
export {};
//# sourceMappingURL=index.d.ts.map