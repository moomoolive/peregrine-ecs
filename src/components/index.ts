import {Allocator} from "../allocator/index"
import {
    tokenizeComponentDef
} from "./tokenizeDef"
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

export type i8<Type extends Types> = Type extends "i8" ? Int8Array : never
export type u8<Type extends Types> = Type extends "u8" ? Uint8Array : never
export type i16<Type extends Types> = Type extends "i16" ? Int16Array : never
export type u16<Type extends Types> = Type extends "u16" ? Uint16Array : never
export type i32<Type extends Types> = Type extends "i32" ? Int32Array : never
export type u32<Type extends Types> = Type extends "u32" ? Uint32Array : never
export type f32<Type extends Types> = Type extends "f32" ? Float32Array : never
export type f64<Type extends Types> = Type extends "f64" ? Float64Array : never
/* alias for f64 */
export type num <Type extends Types> = Type extends "num" ? Float64Array : never

export type ComponentType<Type extends Types> = (
    f64<Type> | num<Type>
    | f32<Type> | i32<Type> | u32<Type>
    | i16<Type> | u16<Type>
    | i8<Type> | u8<Type>
)

export type ComponentDef = {
    readonly [key: string]: Types
}

export type ComponentTypedArray = (
    Uint8Array
    | Int8Array
    | Uint16Array
    | Int16Array
    | Uint32Array
    | Int32Array
    | Float32Array
    | Float64Array
)

export function getComponentSegmentsPtr(
    $allocatorPtrs: Int32Array
): number {
    return $allocatorPtrs[$allocatorPtrs.length - 1]
}

export type ComponentData<Definition extends ComponentDef> = {
    [key in keyof Definition]: ComponentType<Definition[key]>
}

export type Component<Definition extends ComponentDef> = (
    ComponentData<Definition>
)

export type RawComponent<Definition extends ComponentDef> = (
    {data: ComponentData<Definition>}
    & {
        $allocatorPtrs: Int32Array
        databuffers: ComponentTypedArray[]
    }
)

export type ComponentObject<
    Definition extends ComponentDef
> = {
    [key in keyof Definition]: number
}

export type ComponentTokens = ReadonlyArray<{
    name: string,
    type: Types,
    ptrOffset: number
}>

export interface ComponentClass<
    Definition extends ComponentDef
> {
    readonly bytesPerElement: number
    readonly stringifiedDef: string
    readonly tokens: ComponentTokens
    new(
        initialCapacity: number, 
        globalAllocator: Allocator
    ): RawComponent<Definition>
}

export const enum encoding {
    component_ptr_size = 1
}

export function componentMacro<
    Definition extends ComponentDef
>(
    name: string, 
    def: Definition
): ComponentClass<Definition> {
    const {
        componentName,
        fields,
        elementSize
    } = tokenizeComponentDef(name, def)
    const tokens = Object.keys(def).map((field, offset) => {
        return {
            name: field, 
            type: def[field], 
            ptrOffset: offset
        }
    })
    tokens.push({
        name: "$component_segments_ptr", 
        type: "i32", 
        ptrOffset: fields.length
    })
    const segmentsPtrSize = fields.length + encoding.component_ptr_size
    const generatedClass = Function(`return class ${componentName} {
        static stringifiedDef = '${JSON.stringify(def)}'
        static bytesPerElement = ${elementSize}
        static tokens = ${JSON.stringify(tokens)}

        constructor(initialCapacity, globalAllocator) {
            const $component_segments_ptr = globalAllocator.malloc(${segmentsPtrSize} * ${Int32Array.BYTES_PER_ELEMENT})
            this.$allocatorPtrs = new Int32Array(globalAllocator.buf, $component_segments_ptr, ${segmentsPtrSize})
            this.$allocatorPtrs[${fields.length}] = $component_segments_ptr
            ${fields.map(({name, type}, ptrOffset) => {
                return `
            const ${name}_ptr = globalAllocator.malloc(initialCapacity * ${type.BYTES_PER_ELEMENT})
            this.$allocatorPtrs[${ptrOffset}] = ${name}_ptr
            const ${name}_data = new ${type.name}(globalAllocator.buf, ${name}_ptr, initialCapacity)
            `}).join("")}
            this.databuffers = [${fields.map(({name}) => `${name}_data`).join(", ")}]
            this.data = {${fields.map(({name}) => `${name}: ${name}_data`).join(", ")}}
        }
    }`)()

    return generatedClass as ComponentClass<Definition>
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
