import {tokenizeComponentDef} from "./tokenizeDef"
import {err} from "../debugging/errors"

export type Types = (
    "i8"
    | "u8"
    | "i16"
    | "u16"
    | "i32"
    | "u32"
    | "f32"
    | "f64"
    | "num"
)

export type i8<T extends Types> = T extends "i8" ? Int8Array : never
export type u8<T extends Types> = T extends "u8" ? Uint8Array : never
export type i16<T extends Types> = T extends "i16" ? Int16Array : never
export type u16<T extends Types> = T extends "u16" ? Uint16Array : never
export type i32<T extends Types> = T extends "i32" ? Int32Array : never
export type u32<T extends Types> = T extends "u32" ? Uint32Array : never
export type f32<T extends Types> = T extends "f32" ? Float32Array : never
export type f64<T extends Types> = T extends "f64" ? Float64Array : never
/* alias for f64 */
export type num <T extends Types> = T extends "num" ? Float64Array : never

export type ComponentType<T extends Types> = (
    f64<T> | num<T>
    | f32<T> | i32<T> | u32<T>
    | i16<T> | u16<T>
    | i8<T> | u8<T>
)

export type ComponentDef = {
    readonly [key: string]: Types
}

export type ComponentData<T extends ComponentDef> = {
    [key in keyof T]: ComponentType<T[key]>
}

type ComponentGetters<T extends ComponentDef> = {
    [key in keyof T]: (index: number) => number
}

type ComponentSetters<T extends ComponentDef> = {
    [key in keyof T as `set_${key & string}`]: (index: number, val: number) => void
}

export type Component<T extends ComponentDef> = (
    {
        ["@memory"]: ComponentData<T>
        set: (
            index: number,
            offset: number,
            databuffer: Float64Array
        ) => void,
    }
    & ComponentGetters<T>
    & ComponentSetters<T>
)

export type ComponentObject<T extends ComponentDef> = {
    [key in keyof T]: number
}

export interface ComponentClass<T extends ComponentDef> {
    readonly bytesPerElement: number
    readonly def: T
    new(initialCapacity: number): Component<T>
}

export function componentMacro<
    T extends ComponentDef
>(name: string, def: T): ComponentClass<T> {
    const {
        componentName,
        fieldToConstructor,
        allFields,
        elementSize
    } = tokenizeComponentDef(name, def)
    const generatedClass = Function(`return class ${componentName} {
        static def = ${JSON.stringify(def)}
        static bytesPerElement = ${elementSize}

        constructor(initialCapacity) {
            this["@memory"] = {
                ${fieldToConstructor.map(({name, construct}) => {
                    return `${name}: new ${construct}(initialCapacity),`
                }).join("\n\t\t    ")}
            }
        }

        set(index, offset, databuffer) {
            ${allFields.map((field, fieldOffset) => {
                return `this["@memory"].${field}[index] = databuffer[offset${fieldOffset === 0 ? "" : ` + ${fieldOffset}`}]`
            }).join("\n\t\t")}
        }

        ${allFields.map((field) => {
            const getter = `${field}(index) {return this["@memory"].${field}[index]}`
            const setter = `set_${field}(index, val) {this["@memory"].${field}[index] = val; return this}`
            return `${getter};${setter}`
        }).join("\n\t    ")}
    }`)()

    return generatedClass as ComponentClass<T>
}

export type ComponentsDeclaration = {
    readonly [key: string]: ComponentDef
}

export type ComponentClasses = ReadonlyArray<ComponentClass<ComponentDef>>

export function generateComponentClasses(
    declaration: ComponentsDeclaration
): ComponentClasses {
    const components = []
    const keys = Object.keys(declaration)
    if (keys.length < 1) {
        throw SyntaxError(err(`you must declare at least one component`))
    }
    const len = keys.length
    for (let i = 0; i < len; i++) {
        const key = keys[i]
        components.push(componentMacro(key, declaration[key]))
    }
    return components
}
