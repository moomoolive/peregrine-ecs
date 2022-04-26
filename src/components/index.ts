import {tokenizeComponentDef} from "./tokenizeDef"

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

export type Component<T extends ComponentDef> = {
    [key in keyof T]: ComponentType<T[key]>
}

export type ComponentObject<T extends ComponentDef> = {
    [key in keyof T]: number
}

export interface ComponentClass<T extends ComponentDef> {
    readonly def: T
    readonly bytesPerElement: number
    
    new(initialCapacity: number): Component<T>
    push(
        component: Component<T>, 
        obj: ComponentObject<T>,
        length: number
    ): number
    pop(
        component: Component<T>,
        length: number
    ): number
    consume(
        consumer: Component<T>,
        consumed: Component<T>,
        targetIndex: number
    ): void
}

const GARBAGE_COLLECTION_LIMIT = 15

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
        
        static push(component, obj, length) {
            const mutIndex = length
            const len = length + 1
            if (len > component.${allFields[0]}.length) {
                const capacity = length * 2
                ${fieldToConstructor.map(({name, construct}) => {
                    return `const new_${name} = new ${construct}(new SharedArrayBuffer(capacity * ${construct}.BYTES_PER_ELEMENT)); new_${name}.set(component.${name}, 0); component.${name} = new_${name}`
                }).join("\n\t\t    ")}
            }
            ${allFields.map((field) => {
                return `component.${field}[mutIndex] = obj.${field}`
            }).join("\n\t\t")}
            return len
        }

        static pop(component, length) {
            if (length < 1) {
                return length
            }
            if ((component.${allFields[0]}.length - length) > ${GARBAGE_COLLECTION_LIMIT}) {
                const capacity = length + ${GARBAGE_COLLECTION_LIMIT}
                ${fieldToConstructor.map(({name, construct}) => {
                    return `const new_${name} = new ${construct}(new SharedArrayBuffer(capacity * ${construct}.BYTES_PER_ELEMENT)); for (let i = 0; i < length; i++) { new_${name}[i] = component.${name}[i] }; component.${name} = new_${name}`
                }).join("\n\t\t    ")}
            }
            return length - 1
        }

        static consume(consumer, consumed, index) {

        }
        
        constructor(initialCapacity) {
            ${fieldToConstructor.map(({name, construct}) => {
                return `this.${name} = new ${construct}(initialCapacity)`
            }).join("\n\t\t")}
        }
    }`)()

    return generatedClass as ComponentClass<T>
}
