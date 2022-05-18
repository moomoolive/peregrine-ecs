import {
    ComponentsDeclaration,
    computeComponentId
} from "../../components/index"
import {err} from "../../debugging/errors"

export type ComponentRegistry<
    Declaration extends ComponentsDeclaration
> = {
    readonly [key in keyof Declaration]: number | Declaration[key]
}

export const enum registry_encoding {
    max_components = 256
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
