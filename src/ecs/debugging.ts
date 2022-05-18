import {
    StructProxyClasses,
    ComponentTokens,
    ComponentDefinition,
    computeComponentId
} from "../components/index"

export type ComponentDebug = {
    id: number
    bytesPerElement: number
    name: string
    definition: ComponentTokens
    stringifiedDef: string
}

export type ComponentId = number | ComponentDefinition

export function generateComponentDebugInfo(
    componentProxyStructClasses: StructProxyClasses
): ComponentDebug[] {
    const componentDebugInfo = []
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
        componentDebugInfo.push(componentInfo)
    }
    return componentDebugInfo
}
