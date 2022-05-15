import {
    ComponentDefinition,
    ComponentsDeclaration,
    ComponentViews,
    ComponentViewClass,
    ComponentTokens,
} from "../../components/index"
import {err} from "../../debugging/errors"

export type ComponentRegistry<
    Declaration extends ComponentsDeclaration
> = {
    readonly [key in keyof Declaration]: number | Declaration[key]
}

export const MAX_COMPONENTS = 256

export function componentRegistryMacro<
    Declartion extends ComponentsDeclaration
>(
    declartion: Declartion
): ComponentRegistry<Declartion> {
    const keys = Object.keys(declartion)
    if (keys.length < 1) {
        throw SyntaxError(err("component declaration must have at least one component"))
    } else if (keys.length > MAX_COMPONENTS) {
        throw SyntaxError(err(`too many components, allowed=${MAX_COMPONENTS}, got=${keys.length}`))
    }
    const registry = {}
    for (let i = 0; i < keys.length; i++) {
        /* 
        the component name and fields are sanitized by 
        the macro that creates the components classes,
        which runs before this. So there is no need to check
        if fields/component names are correct. 
        */
        Object.defineProperty(registry, keys[i], {value: i})
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

export function debugComponent(
    component: ComponentId,
    ComponentViews: ComponentViews
): ComponentDebug {
    const componentClass = ComponentViews[component as number]
    const {
        name, 
        bytesPerElement,
        tokens,
        stringifiedDefinition
    } = componentClass as unknown as ComponentViewClass<ComponentDefinition>
    return {
        definition: tokens,
        bytesPerElement,
        name,
        stringifiedDef: stringifiedDefinition,
        id: component as number
    }
}
