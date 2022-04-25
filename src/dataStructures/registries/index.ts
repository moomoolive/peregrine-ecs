import {
    ComponentDef,
    ComponentClass
} from "../../components/index"
import {err} from "../../debugging/errors"

export type ComponentsDeclaration = {
    readonly [key: string]: ComponentDef
}

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

function getComponentSize(def: ComponentDef): number {
    let size = 0
    const keys = Object.keys(def)
    const len = keys.length
    for (let i = 0; i < len; i++) {
        const key = keys[i]
        switch(def[key]) {
            case "u8":
            case "i8":
                size += 1
                break
            case "i16":
            case "u16":
                size += 2
                break
            case "u32":
            case "i32":
            case "f32":
                size += 4
                break
            case "num":
            case "f64":
                size += 8
                break
            
        }
    }
    return size
}

export type ComponentDebug = {
    def: ComponentDef
    id: number
    bytesPerElement: number
    name: string
}

export function debugComponent(
    component: number | ComponentDef,
    componentRefs: ComponentClass<ComponentDef>[]
): ComponentDebug {
    const ref = componentRefs[component as number]
    const def = ref.def
    return {
        def,
        id: component as number,
        bytesPerElement: getComponentSize(def),
        name: ref.name
    }
}
