import {
    ComponentDef,
    ComponentsDeclaration,
    ComponentClasses,
    ComponentClass,
    ComponentTokens,
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

export type ComponentDebug = {
    id: number
    bytesPerElement: number
    name: string
    definition: ComponentTokens
    stringifiedDef: string
}

export type ComponentId = number | ComponentDef

export function debugComponent(
    component: ComponentId,
    componentClasses: ComponentClasses
): ComponentDebug {
    const componentClass = componentClasses[component as number]
    const {
        name, 
        bytesPerElement,
        tokens,
        stringifiedDef
    } = componentClass as unknown as ComponentClass<ComponentDef>
    return {
        definition: tokens,
        bytesPerElement,
        name,
        stringifiedDef,
        id: component as number
    }
}
