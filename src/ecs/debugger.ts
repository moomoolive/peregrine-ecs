import {
    ComponentId,
    ComponentDebug,
    computeComponentId
} from "../dataStructures/registries/index"
import {
    StructProxyClasses,
    ComponentsDeclaration
} from "../components/index"
import {standard_entity} from "../entities/index"

export class Debugger<
    Components extends ComponentsDeclaration
> {
    private componentDebugInfo: ComponentDebug[]
    
    readonly schemas: Components

    constructor(
        componentProxyStructClasses: StructProxyClasses,
        components: Components
    ) {
        const componentsCopy = JSON.parse(JSON.stringify(components))
        this.schemas = Object.freeze(componentsCopy)
        this.componentDebugInfo = []
        for (let i = 0; i < componentProxyStructClasses.length; i++) {
            const {
                name, 
                bytesPerElement,
                tokens,
                stringifiedDefinition,
            } = componentProxyStructClasses[i]
            const tokensCopy = JSON.parse(JSON.stringify(tokens))
            const componentInfo = {
                definition: tokensCopy,
                bytesPerElement,
                name,
                stringifiedDef: stringifiedDefinition,
                id: computeComponentId(i)
            }
            this.componentDebugInfo.push(componentInfo)
        } 
    }

    get componentCount(): number {
        return this.componentDebugInfo.length
    }

    componentInfo(
        componentId: ComponentId
    ): ComponentDebug {
        /* component ids are number under the hood, but 
        the have the "or component declaration" component
        to allow for good intellisense in certain situations
        (such as querying, etc.) */
        const id = (
            componentId as number
            - standard_entity.reserved_count
        )
        return this.componentDebugInfo[id]
    }

    allComponents(): ReadonlyArray<ComponentDebug> {
        return this.componentDebugInfo
    }
}