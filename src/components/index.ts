import {
    tokenizeComponentDef,
    Types,
    ComponentTypedArrayConstructor,
    ComponentTokens,
    ComponentTypedArray,
    component_viewer_encoding
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

export type ComponentGetters<
    Definition extends ComponentDefinition
> = {
    [key in keyof Definition]: (index: number) => number
}

export type ComponentSetters<
    Definition extends ComponentDefinition
> = {
    [key in keyof Definition as `set_${key & string}`]: (
        index: number, value: number
    ) => void
}

export type ComponentFieldAccessors<
    Definition extends ComponentDefinition
> = (
    ComponentGetters<Definition>
    & ComponentSetters<Definition>
)

export type RawComponentView<
    Definition extends ComponentDefinition
> = (
    ComponentFieldAccessors<Definition>
    & {"@@databuffer": ComponentTypedArray}
)

export interface ComponentViewFactory<
    Definition extends ComponentDefinition
> {
    new(
        databuffers: ComponentTypedArray
    ): RawComponentView<Definition>
}

function createComponentViewClass<
    Definition extends ComponentDefinition
>(
    {
        fields,
        componentSegments
    }: ComponentTokens
): ComponentViewFactory<Definition> {
    const BaseView = function(
        this: RawComponentView<ComponentDefinition>,
        self: ComponentTypedArray
    ) {
        this[component_viewer_encoding.databuffer_ref] = self
    }
    const viewPrototype = {}
    const indexesPerElement = componentSegments
    
    const {name: firstField} = fields[0]
    /* ideally these setters & getters will be compiled 
    away by a build tool -> to make code more efficent */
    /* create getter method that maps field name
    to index in typed array */
    Object.defineProperty(viewPrototype, firstField, {
        value(index: number) { 
            return this[component_viewer_encoding.databuffer_ref][index * indexesPerElement]
        }
    })
    /* create setter method that maps field name
    to index in typed array */
    const firstSetterName = (
        component_viewer_encoding.field_setter_prefix
        + firstField
    )
    Object.defineProperty(viewPrototype, firstSetterName, {
        value(index: number, value: number) { 
            this[component_viewer_encoding.databuffer_ref][index * indexesPerElement] = value
        }
    })


    /* create rest of members */
    for (let i = 1; i < fields.length; i++) {
        const {name: fieldName, databufferOffset} = fields[i]
        Object.defineProperty(viewPrototype, fieldName, {
            value(index: number) { 
                return this["@@databuffer"][(index * indexesPerElement) + databufferOffset] 
            }
        })
        const setterName = (
            component_viewer_encoding.field_setter_prefix
            + fieldName
        )
        Object.defineProperty(viewPrototype, setterName, {
            value(index: number, value: number) { 
                this["@@databuffer"][(index * indexesPerElement) + databufferOffset] = value
            }
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
    databuffer: ComponentTypedArray
    memoryConstructor: ComponentTypedArrayConstructor
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
        this.memoryConstructor = memoryConstructor
        const databuffer = new memoryConstructor(
            memoryBuffer, componentPtr, initialCapacity
        )
        this.databuffer = databuffer
        this.bytesPerElement = bytesPerElement
        this.componentSegements = componentSegements
        this.bytesPerField = bytesPerField
        this.data = new View(databuffer)
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
    definition: Definition
): ComponentViewClass<Definition> {
    const tokens = tokenizeComponentDef(name, definition)
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
