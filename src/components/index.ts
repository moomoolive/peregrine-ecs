import {
    tokenizeComponentDef,
    Types,
    ComponentTypedArrayConstructor,
    ComponentTokens,
    ComponentTypedArray
} from "./tokenizeDef"
import {err} from "../debugging/errors"

export {Types, ComponentTokens} from "./tokenizeDef"

export type i32<Type extends Types> = Type extends "i32" ? Int32Array : never
export type f32<Type extends Types> = Type extends "f32" ? Float32Array : never
export type f64<Type extends Types> = Type extends "f64" ? Float64Array : never
/* alias for f64 */
export type num <Type extends Types> = Type extends "num" ? Float64Array : never

export type ComponentType<Type extends Types> = (
    f64<Type> | num<Type> | f32<Type> | i32<Type>
)

export type ComponentDefinition = {
    readonly [key: string]: Types
}

export type ComponentData<
    Definition extends ComponentDefinition
> = {
    [key in keyof Definition]: ComponentType<Definition[key]>
}

export type RawComponentView<
    Definition extends ComponentDefinition
> = (
    ComponentData<Definition>
    & {"@self": ComponentTypedArray[]}
)

export interface ComponentViewFactory<
    Definition extends ComponentDefinition
> {
    new(
        databuffers: ComponentTypedArray[]
    ): RawComponentView<Definition>
}

function createComponentViewClass<
    Definition extends ComponentDefinition
>(
    tokens: ComponentTokens
): ComponentViewFactory<Definition> {
    const BaseView = function(
        this: RawComponentView<ComponentDefinition>,
        self: ComponentTypedArray[]
    ) {
        this["@self"] = self
    }
    const viewPrototype = {}
    for (let i = 0; i < tokens.fields.length; i++) {
        const {name, databufferOffset} = tokens.fields[i]
        /* create getter methods that map field names
        to a buffer
        */
        Object.defineProperty(viewPrototype, name, {
            get() { return this["@self"][databufferOffset] }
        })
    }
    BaseView.prototype = viewPrototype
    return BaseView as unknown as ComponentViewFactory<Definition>
}

export class RawComponent<Definition extends ComponentDefinition> {
    readonly id: number
    readonly bytesPerElement: number
    readonly componentSegements: number
    readonly bytesPerField: number
    memoryConstructor: ComponentTypedArrayConstructor
    databuffers: ComponentTypedArray[]
    data: RawComponentView<Definition>

    constructor(
        {
            View,
            bytesPerElement,
            componentSegements,
            bytesPerField,
            memoryConstructor,
            id
        }: ComponentViewClass<Definition>,
        memoryBuffer: SharedArrayBuffer,
        componentPtr: number,
        initialCapacity: number
    ) {
        this.databuffers = []
        this.memoryConstructor = memoryConstructor
        this.bytesPerElement = bytesPerElement
        this.componentSegements = componentSegements
        this.bytesPerField = bytesPerField

        const databuffers = this.databuffers
        let ptr = componentPtr
        const segementSize = bytesPerElement * initialCapacity
        for (let i = 0; i < componentSegements; i++) {
            const segment = new memoryConstructor(
                memoryBuffer, ptr, initialCapacity
            )
            databuffers.push(segment)
            ptr += segementSize
        }

        this.data = new View(databuffers)
        this.id = id
    }
}

export type ComponentObject<
    Definition extends ComponentDefinition
> = {
    [key in keyof Definition]: number
}

export class ComponentViewClass<
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
    View: ComponentViewFactory<Definition>

    constructor(
        id: number,
        tokens: ComponentTokens,
        View: ComponentViewFactory<Definition>
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

export function componentViewMacro<
    Definition extends ComponentDefinition
>(
    id: number,
    name: string, 
    def: Definition
): ComponentViewClass<Definition> {
    const tokens = tokenizeComponentDef(name, def)
    const ViewClass = createComponentViewClass<Definition>(tokens)
    const componentViewClass = new ComponentViewClass(
        id, tokens, ViewClass
    )
    return componentViewClass
}

export type ComponentsDeclaration = {
    readonly [key: string]: ComponentDefinition
}

export type ComponentViews = ReadonlyArray<
ComponentViewClass<ComponentDefinition>
>

export function generateComponentViewClasses(
    declaration: ComponentsDeclaration
): ComponentViews {
    const components = []
    const componentNames = Object.keys(declaration)
    if (componentNames.length < 1) {
        throw SyntaxError(err(`you must declare at least one component`))
    }

    for (let i = 0; i < componentNames.length; i++) {
        const name = componentNames[i]
        const definition = declaration[name]
        const id = i
        const componentView = componentViewMacro(
            id, name, definition
        )
        components.push(componentView)
    }
    return components
}
