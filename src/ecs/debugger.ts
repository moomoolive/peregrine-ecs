import {
    debugComponent,
    ComponentId,
    ComponentDebug
} from "../dataStructures/registries/index"
import {
    ComponentsDeclaration,
    ComponentDef
} from "../components/index"
import type {BaseEcs as Ecs} from "./index"

export class Debugger {
    private "@self": Ecs<ComponentsDeclaration>
    readonly componentCount: number

    constructor(self: Ecs<ComponentsDeclaration>) {
        this["@self"] = self
        this.componentCount = this["@self"]["_componentClasses"].length
    }

    componentInfo<T extends ComponentDef>(
        componentId: ComponentId<T>
    ): ComponentDebug<T> {
        return debugComponent(
            componentId,
            this["@self"]["_componentClasses"]
        )
    }

    allComponents(): ComponentDebug<ComponentDef>[] {
        const componentsDebug = []
        const len = this["@self"]["_componentClasses"].length
        for (let i = 0; i < len; i++) {
            const component = this["@self"]["_componentClasses"][i]
            componentsDebug.push({
                id: i,
                definition: component.def,
                name: component.name,
                bytesPerElement: component.bytesPerElement
            })
        }
        return componentsDebug
    }
}