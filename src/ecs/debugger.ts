import {
    debugComponent,
    ComponentId,
    ComponentDebug
} from "../dataStructures/registries/index"
import {
    ComponentDef,
    ComponentClasses
} from "../components/index"

export class Debugger {
    readonly componentClasses: ComponentClasses
    readonly componentCount: number

    constructor(componentClasses: ComponentClasses) {
        this.componentClasses = componentClasses
        this.componentCount = componentClasses.length
    }

    componentInfo<T extends ComponentDef>(
        componentId: ComponentId<T>
    ): ComponentDebug<T> {
        return debugComponent(
            componentId, this.componentClasses
        )
    }

    allComponents(): ComponentDebug<ComponentDef>[] {
        const componentsDebug = []
        const len = this.componentClasses.length
        for (let i = 0; i < len; i++) {
            const component = this.componentClasses[i]
            componentsDebug.push({
                id: i,
                definition: component.def,
                name: component.name,
                bytesPerElement: component.bytesPerElement,
                tokens: component.tokens
            })
        }
        return componentsDebug
    }
}