import {
    ComponentDef,
    ComponentsDeclaration,
    ComponentClasses
} from "../../components/index"
import {err} from "../../debugging/errors"

export type ComponentRegistry<T extends ComponentsDeclaration> = {
    readonly [key in keyof T]: number | T[key]
}

export const MAX_COMPONENTS = 256

export function componentRegistryMacro<
    T extends ComponentsDeclaration
>(declartion: T): ComponentRegistry<T> {
    const keys = Object.keys(declartion)
    if (keys.length < 1) {
        throw SyntaxError(err("component declaration must have at least one component"))
    } else if (keys.length > MAX_COMPONENTS) {
        throw SyntaxError(err(`too many components, allowed=${MAX_COMPONENTS}, got=${keys.length}`))
    }
    let components = ""
    const len = keys.length
    for (let i = 0; i < len; i++) {
        const field = keys[i]
        components += `\n\t\t${field}: ${i},`
    }
    return Function(`return Object.freeze({${components}})`)()
}

export type ComponentDebug<T extends ComponentDef> = {
    definition: T
    id: number
    bytesPerElement: number
    name: string
}

export type ComponentId<T extends ComponentDef> = number | T

export function debugComponent<T extends ComponentDef>(
    component: ComponentId<T>,
    componentClasses: ComponentClasses
): ComponentDebug<T> {
    const componentClass = componentClasses[component as number]
    const {def, name, bytesPerElement} = componentClass
    return {
        definition: def as T,
        bytesPerElement,
        name,
        id: component as number
    }
}
