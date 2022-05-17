import {
    ComponentDefinition,
    ComponentsDeclaration,
    ComponentTokens,
} from "../../components/index"
import {err} from "../../debugging/errors"
import {standard_entity} from "../../entities/index"

export type ComponentRegistry<
    Declaration extends ComponentsDeclaration
> = {
    readonly [key in keyof Declaration]: number | Declaration[key]
}

export const enum registry_encoding {
    max_components = 256
}

export const MAX_COMPONENTS = registry_encoding.max_components

export function computeComponentId(offset: number): number {
    return offset + standard_entity.reserved_end
}

export function componentRegistryMacro<
    Declartion extends ComponentsDeclaration
>(
    declartion: Declartion
): ComponentRegistry<Declartion> {
    const componentNames = Object.keys(declartion)
    if (componentNames.length < 1) {
        throw SyntaxError(err("component declaration must have at least one component"))
    } else if (componentNames.length > registry_encoding.max_components) {
        throw SyntaxError(err(`too many components, allowed=${MAX_COMPONENTS}, got=${componentNames.length}`))
    }

    /* order names alphabetically */
    const keys = componentNames.slice().sort()
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

export type ComponentDebug = {
    id: number
    bytesPerElement: number
    name: string
    definition: ComponentTokens
    stringifiedDef: string
}

export type ComponentId = number | ComponentDefinition
