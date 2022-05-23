import {
    tokenizeComponentDef,
    Types,
    ComponentTypedArrayConstructor,
    ComponentTokens,
    ComponentTypedArray,
    struct_proxy_encoding
} from "./tokenizeDef"
import {err} from "../debugging/errors"
import {standard_entity} from "../entities/index"

export type {Types, ComponentTokens} from "./tokenizeDef"
export {struct_proxy_encoding} from "./tokenizeDef"

/*
export type i32<Type extends Types> = Type extends "i32" ? Int32Array : never
export type f32<Type extends Types> = Type extends "f32" ? Float32Array : never
export type f64<Type extends Types> = Type extends "f64" ? Float64Array : never
export type num <Type extends Types> = Type extends "num" ? Float64Array : never

export type ComponentType<Type extends Types> = (
    f64<Type> | num<Type> | f32<Type> | i32<Type>
)
*/

export type ComponentDefinition = {
    readonly [key: string]: Types
}

export type StructProxy<
    Definition extends ComponentDefinition
> = {
    [key in keyof Definition]: number
}

interface ComponentReference {
    databuffer: ComponentTypedArray
}

export type RawStructProxy<
    Definition extends ComponentDefinition
> = (
    StructProxy<Definition>
    & {
        "@@component": ComponentReference,
        "@@offset": number
    }
)

export interface StructProxyFactory<
    Definition extends ComponentDefinition
> {
    new(
        component: ComponentReference,
        offset: number
    ): RawStructProxy<Definition>
}

function createComponentViewClass<
    Definition extends ComponentDefinition
>(
    {fields, componentName}: ComponentTokens
): StructProxyFactory<Definition> {
    const BaseStructProxy = function(
        this: RawStructProxy<ComponentDefinition>,
        component: ComponentReference,
        offset: number
    ) {
        this[struct_proxy_encoding.databuffer_ref] = component
        this[struct_proxy_encoding.buffer_offset] = offset
    }

    /* set function name for proxy class, 
    so that the console displays
    a name that makes sense for each proxy */
    Object.defineProperty(BaseStructProxy, "name", {
        value: `${componentName}StructProxy`
    })

    const viewPrototype = {}
    /* create setter & getter methods that map field names
    to offset in typed array */
    for (let i = 0; i < fields.length; i++) {
        const {
            name: fieldName, 
            databufferOffset
        } = fields[i]
        Object.defineProperty(viewPrototype, fieldName, {
            get(this: RawStructProxy<Definition>) {
                return this["@@component"].databuffer[this["@@offset"] + databufferOffset]
            },
            set(this: RawStructProxy<Definition>, value: number) {
                this["@@component"].databuffer[this["@@offset"] + databufferOffset] = value
            }
        })
    }
    BaseStructProxy.prototype = viewPrototype
    return BaseStructProxy as unknown as StructProxyFactory<Definition>
}

export class RawComponent<
    Definition extends ComponentDefinition
> {
    readonly id: number
    readonly bytesPerElement: number
    readonly componentSegements: number
    databuffer: ComponentTypedArray
    memoryConstructor: ComponentTypedArrayConstructor
    structProxyFactory: StructProxyFactory<Definition>

    constructor(
        id: number,
        bytesPerElement: number,
        componentSegments: number,
        memoryConstructor: ComponentTypedArrayConstructor,
        View: StructProxyFactory<Definition>,
        databuffer: ComponentTypedArray
    ) {
        this.memoryConstructor = memoryConstructor
        this.bytesPerElement = bytesPerElement
        this.componentSegements = componentSegments
        this.databuffer = databuffer
        this.structProxyFactory = View
        this.id = id
    }

    index(index: number): StructProxy<Definition> {
        return new this.structProxyFactory(
            this, index * this.componentSegements
        )
    }
}

export type Component<Definition extends ComponentDefinition> = (
    Pick<RawComponent<Definition>, "index">
)

export class StructProxyClass<
    Definition extends ComponentDefinition
> {
    readonly bytesPerElement: number
    readonly stringifiedDefinition: string
    readonly tokens: ComponentTokens
    readonly name: string
    readonly componentSegements: number
    readonly bytesPerField: number
    readonly id: number
    memoryConstructor: ComponentTypedArrayConstructor
    View: StructProxyFactory<Definition>

    constructor(
        id: number,
        tokens: ComponentTokens,
        View: StructProxyFactory<Definition>
    ) {
        const {
            bytesPerElement, stringifiedDefinition,
            componentName, componentSegments,
            bytesPerField, memoryConstructor
        } = tokens
        this.View = View
        this.memoryConstructor = memoryConstructor
        this.bytesPerElement = bytesPerElement
        this.componentSegements = componentSegments
        this.bytesPerField = bytesPerField
        this.stringifiedDefinition = stringifiedDefinition
        this.tokens = tokens
        this.name = componentName
        this.id = id
    }
}

export function structProxyMacro<
    Definition extends ComponentDefinition
>(
    id: number,
    name: string, 
    definition: Definition
): StructProxyClass<Definition> {
    const tokens = tokenizeComponentDef(name, definition)
    const ViewClass = createComponentViewClass<Definition>(tokens)
    const componentViewClass = new StructProxyClass(
        id, tokens, ViewClass
    )
    return componentViewClass
}

export type ComponentsDeclaration = {
    readonly [key: string]: ComponentDefinition
}

export type StructProxyClasses = ReadonlyArray<
    StructProxyClass<ComponentDefinition>
>

export function computeComponentId(offset: number): number {
    return offset + standard_entity.components_start
}

export function deserializeComponentId(id: number): number {
    return id - standard_entity.reserved_count
}

export function orderKeysByName(keys: string[]): string[] {
    /* components are order alphabetically */
    return keys.sort()
}

export function orderComponentsByName(
    declaration: ComponentsDeclaration
): string[] {
    return orderKeysByName(Object.keys(declaration))
}

export function generateComponentStructProxies(
    declaration: ComponentsDeclaration
): {
    proxyClasses: StructProxyClasses,
    orderedComponentNames: string[]
} {
    const componentNames = orderComponentsByName(declaration)
    if (componentNames.length < 1) {
        throw SyntaxError(err(`you must declare at least one component`))
    }
    const proxyClasses = []
    for (let i = 0; i < componentNames.length; i++) {
        const name = componentNames[i]
        const definition = declaration[name]
        const id = computeComponentId(i)
        const proxyStructClass = structProxyMacro(
            id, name, definition
        )
        proxyClasses.push(proxyStructClass)
    }
    return {proxyClasses, orderedComponentNames: componentNames}
}
