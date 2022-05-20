import {
    ComponentsDeclaration,
    computeComponentId,
    orderKeysByName
} from "../../components/index"
import {err, assert} from "../../debugging/errors"
import {
    component_entity_encoding,
    standard_entity
} from "../../entities/index"

export type ComponentRegistry<
    Declaration extends ComponentsDeclaration
> = {
    readonly [key in keyof Declaration]: number | Declaration[key]
}

export const enum registry_encoding {
    max_components = component_entity_encoding.max_count
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
        Object.defineProperty(registry, keys[i], {value: entityId})
    }
    return Object.freeze(registry) as ComponentRegistry<Declartion>
}

export type IdDeclaration = ReadonlyArray<string>

export function computeRelationId(offset: number): number {
    return offset + standard_entity.relations_start
}

const STANDARD_RELATIONS = [
    "instanceof"
] as const

export const enum relation_registy_encoding {
    standard_relations_count = 1
}

export type RelationRegisty<
    Declaration extends IdDeclaration
> = (
    { readonly [key in Declaration[number]]: number }
    & { readonly [key in typeof STANDARD_RELATIONS[number]]: number }
)

export function relationRegistryMacro<
    Declaration extends IdDeclaration
>(relationNames: Declaration): {
    relations: RelationRegisty<Declaration>,
    orderedKeys: string[]
} {
    assert(!Array.isArray(relationNames), `relations must be inputted as an array of strings (got type "${typeof relationNames}")`)
    const relationKeys = orderKeysByName([
        ...STANDARD_RELATIONS,
        ...relationNames.slice()
    ])
    const registry = {}
    for (let i = 0; i < relationKeys.length; i++) {
        /* 
        the component name and fields are sanitized by 
        the macro that creates the components classes,
        which runs before this. So there is no need to check
        if fields/component names are correct. 
        */
        const entityId = computeRelationId(i)
        Object.defineProperty(registry, relationKeys[i], {value: entityId})
    }
    return {
        relations: Object.freeze(registry) as RelationRegisty<Declaration>,
        orderedKeys: relationKeys
    }
}
