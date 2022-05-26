import {
    ComponentsDeclaration,
    computeComponentId,
    orderKeysByName
} from "../../components/index"
import {
    err,
    incorrectSchema
} from "../../debugging/errors"
import {
    component_entity_encoding,
    standard_entity
} from "../../entities/index"
import {
    makeIdImmutable,
    makeIdSized
} from "../../entities/ids"
import {STANDARD_RELATIONS_INDEX} from "./standardRelations"
import {STANDARD_ENTITIES} from "./standardEntities"

export type ComponentRegistry<
    Declaration extends ComponentsDeclaration
> = {
    readonly [key in keyof Declaration]: number | Declaration[key]
}

export const enum registry_encoding {
    max_components = component_entity_encoding.max_count
}

function applyComponentIdFlags(id: number): number {
    const immutable = makeIdImmutable(id)
    const sized = makeIdSized(immutable)
    return sized
}

export function componentRegistryMacro<
    Declartion extends ComponentsDeclaration
>(
    componentNames: string[],
): ComponentRegistry<Declartion> {
    if (componentNames.length < 1) {
        throw SyntaxError(err("component declaration must have at least one component"))
    } else if (componentNames.length > registry_encoding.max_components) {
        throw SyntaxError(err(`too many components, allowed=${registry_encoding.max_components}, got=${componentNames.length}`))
    }

    const keys = componentNames
    const registry = {}
    for (let i = 0; i < keys.length; i++) {
        /* 
        the component name and fields are sanitized by 
        the macro that creates the components classes,
        which runs before this. So there is no need to check
        if fields/component names are correct. 
        */
        const entityId = computeComponentId(i)
        const idWithMeta = applyComponentIdFlags(entityId)
        Object.defineProperty(registry, keys[i], {value: idWithMeta})
    }
    return Object.freeze(registry) as ComponentRegistry<Declartion>
}

export function computeRelationId(offset: number): number {
    return offset + standard_entity.relations_start
}

export const ENTITY_DECLARATION_TYPES = [
    "immutable",
    "reserved"
] as const

function correctEntityType(type: string): boolean {
    switch(type) {
        case "immutable":
        case "reserved":
            return true
        default:
            return false
    }
}

export type EntityType = (
    typeof ENTITY_DECLARATION_TYPES[number] & string
)

export type IdDeclaration = {
    readonly [key: string]: EntityType
}

export type IdRegistry<Declaration extends IdDeclaration> = {
    readonly [key in keyof Declaration]: number
}

export const enum relation_registy_encoding {
    standard_relations_count = 1
}

export type StandardEntityIndex = ReadonlyArray<{
    name: string,
    type: EntityType,
    id: number
}>

// made with the help of this beautiful answer: https://stackoverflow.com/questions/71918556/typescript-creating-object-type-from-readonly-array
export type StandardEntitiesDeclartion<
    Index extends StandardEntityIndex
> = {
    [relation in Index[number] as relation["name"]]: relation["type"]
}

function entityRegistryMacro<
    Declaration extends IdDeclaration,
    Index extends StandardEntityIndex
>(
    declaredEntities: Declaration,
    registryFor: string,
    standardEntities: Index,
    idComputeFn: (offset: number) => number
): {
    registry: (
        IdRegistry<Declaration>
        & IdRegistry<StandardEntitiesDeclartion<Index>>
    ),
    orderedKeys: string[]
} {
    if (typeof declaredEntities !== "object" || declaredEntities ===  null || Array.isArray(declaredEntities)) {
        throw incorrectSchema(`declared ${registryFor} must be an object with string values of ${ENTITY_DECLARATION_TYPES.join(", ")}. Got ${declaredEntities} (type=${typeof declaredEntities}).`)
    }
    const registry = {}
    /* create standard entities, standard entities have
    their ids known ahead of time, while user defined ones
    are only known at runtime */
    for (let i = 0; i < standardEntities.length; i++) {
        const {name, id, type} = standardEntities[i]
        const idWithMeta = type === "immutable" ? 
            makeIdImmutable(id) : id
        Object.defineProperty(registry, name, {value: idWithMeta})
    }

    const standardKeys = standardEntities.map(({name}) => name)

    /* create user defined entities */
    const relationKeys = orderKeysByName(Object.keys(declaredEntities))
    for (let i = 0; i < relationKeys.length; i++) {
        const name = relationKeys[i]
        const type = declaredEntities[name]
        if (typeof type !== "string" || !correctEntityType(type)) {
            throw incorrectSchema(`declared ${registryFor} "${name}" is an incorrect type (type=${typeof type}, value=${type}). Declared ${registryFor} must be a string value of ${ENTITY_DECLARATION_TYPES.join(", ")}.`)
        }
        const entityId = idComputeFn(i)
        const idWithMeta = type === "immutable" ? 
            makeIdImmutable(entityId) : entityId
        Object.defineProperty(
            registry, relationKeys[i], {value: idWithMeta}
        )
    }
    
    return {
        registry: Object.freeze(registry) as (
            IdRegistry<Declaration>
            & IdRegistry<StandardEntitiesDeclartion<Index>>
        ),
        orderedKeys: [...standardKeys, ...relationKeys]
    }
}

export const enum standard_relations {
    any = standard_entity.relations_start
}

export type StandardRelationsDeclartion = StandardEntitiesDeclartion<typeof STANDARD_RELATIONS_INDEX>

type PrivateRelations = "wildcard" | "__reserved__"

export type RelationRegisty<
    Declaration extends IdDeclaration
> = (
    IdRegistry<Declaration>
    & Omit<IdRegistry<StandardRelationsDeclartion>, PrivateRelations>
)

export type RelationRegistyRaw<
    Declaration extends IdDeclaration
> = (
    IdRegistry<Declaration>
    & IdRegistry<StandardRelationsDeclartion>
)

export function computeNonStandardRelationId(offset: number): number {
    return computeRelationId(STANDARD_RELATIONS_INDEX.length + offset)
}

export function relationRegistryMacro<
    Declaration extends IdDeclaration
>(declaredRelations: Declaration): {
    registry: RelationRegistyRaw<Declaration>,
    orderedKeys: string[]
} {
    return entityRegistryMacro(
        declaredRelations, "relations", STANDARD_RELATIONS_INDEX,
        computeNonStandardRelationId
    ) 
}

export type StandardUserspaceEntityDeclaration = StandardEntitiesDeclartion<typeof STANDARD_ENTITIES>

export type PrivateEntities = (
    "__reserved__" | "wildcard"
)

export type EntityRegistry<
    Declaration extends IdDeclaration
> = (
    IdRegistry<Declaration>
    & Omit<IdRegistry<StandardUserspaceEntityDeclaration>, PrivateEntities>
)

export type EntityRegistryRaw<
    Declaration extends IdDeclaration
> = (
    IdRegistry<Declaration>
    & IdRegistry<StandardUserspaceEntityDeclaration>
)

export function computeEntityId(offset: number): number {
    return offset + standard_entity.start_of_user_defined_entities
}

export function computeNonStandardEntityId(offset: number): number {
    return computeEntityId(offset + STANDARD_ENTITIES.length)
}

export function entitiesRegistryMacro<
    Declaration extends IdDeclaration
>(declaredRelations: Declaration): {
    registry: EntityRegistryRaw<Declaration>,
    orderedKeys: string[]
} {
    return entityRegistryMacro(
        declaredRelations, "entities", STANDARD_ENTITIES,
        computeNonStandardEntityId
    ) 
}