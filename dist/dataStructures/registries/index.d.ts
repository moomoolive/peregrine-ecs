import { ComponentsDeclaration } from "../../components/index";
import { STANDARD_RELATIONS_INDEX } from "./standardRelations";
import { STANDARD_ENTITIES } from "./standardEntities";
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
export declare type StandardEntityIndex = ReadonlyArray<{
    name: string;
    type: EntityType;
    id: number;
}>;
export declare type StandardEntitiesDeclartion<Index extends StandardEntityIndex> = {
    [relation in Index[number] as relation["name"]]: relation["type"];
};
export declare const enum standard_relations {
    any = 562
}
export declare type StandardRelationsDeclartion = StandardEntitiesDeclartion<typeof STANDARD_RELATIONS_INDEX>;
declare type PrivateRelations = "wildcard" | "__reserved__";
export declare type RelationRegisty<Declaration extends IdDeclaration> = (IdRegistry<Declaration> & Omit<IdRegistry<StandardRelationsDeclartion>, PrivateRelations>);
export declare type RelationRegistyRaw<Declaration extends IdDeclaration> = (IdRegistry<Declaration> & IdRegistry<StandardRelationsDeclartion>);
export declare function computeNonStandardRelationId(offset: number): number;
export declare function relationRegistryMacro<Declaration extends IdDeclaration>(declaredRelations: Declaration): {
    registry: RelationRegistyRaw<Declaration>;
    orderedKeys: string[];
};
export declare type StandardUserspaceEntityDeclaration = StandardEntitiesDeclartion<typeof STANDARD_ENTITIES>;
export declare type PrivateEntities = ("__reserved__" | "wildcard");
export declare type EntityRegistry<Declaration extends IdDeclaration> = (IdRegistry<Declaration> & Omit<IdRegistry<StandardUserspaceEntityDeclaration>, PrivateEntities>);
export declare type EntityRegistryRaw<Declaration extends IdDeclaration> = (IdRegistry<Declaration> & IdRegistry<StandardUserspaceEntityDeclaration>);
export declare function computeEntityId(offset: number): number;
export declare function computeNonStandardEntityId(offset: number): number;
export declare function entitiesRegistryMacro<Declaration extends IdDeclaration>(declaredRelations: Declaration): {
    registry: EntityRegistryRaw<Declaration>;
    orderedKeys: string[];
};
export {};
//# sourceMappingURL=index.d.ts.map