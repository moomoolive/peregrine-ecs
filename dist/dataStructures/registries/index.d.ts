import { ComponentsDeclaration } from "../../components/index";
export declare type ComponentRegistry<Declaration extends ComponentsDeclaration> = {
    readonly [key in keyof Declaration]: number | Declaration[key];
};
export declare const enum registry_encoding {
    max_components = 256
}
export declare function componentRegistryMacro<Declartion extends ComponentsDeclaration>(componentNames: string[]): ComponentRegistry<Declartion>;
export declare function computeRelationId(offset: number): number;
export declare const ENTITY_DECLARATION_TYPES: readonly ["immutable", "reserved"];
export declare type EntityType = (typeof ENTITY_DECLARATION_TYPES[number] & string);
export declare type IdDeclaration = {
    readonly [key: string]: EntityType;
};
export declare type IdRegistry<Declaration extends IdDeclaration> = {
    readonly [key in keyof Declaration]: number;
};
export declare const enum relation_registy_encoding {
    standard_relations_count = 1
}
export declare const STANDARD_RELATIONS: {
    readonly instanceof: "immutable";
    readonly wildcard: "immutable";
};
export declare type RelationRegisty<Declaration extends IdDeclaration> = (IdRegistry<Declaration> & IdRegistry<typeof STANDARD_RELATIONS>);
export declare function relationRegistryMacro<Declaration extends IdDeclaration>(declaredRelations: Declaration): {
    registry: RelationRegisty<Declaration>;
    orderedKeys: string[];
};
export declare const STANDARD_ENTITIES: {};
export declare type EntityRegistry<Declaration extends IdDeclaration> = (IdRegistry<Declaration> & IdRegistry<typeof STANDARD_ENTITIES>);
export declare function computeEntityId(offset: number): number;
export declare function entitiesRegistryMacro<Declaration extends IdDeclaration>(declaredRelations: Declaration): {
    registry: EntityRegistry<Declaration>;
    orderedKeys: string[];
};
//# sourceMappingURL=index.d.ts.map