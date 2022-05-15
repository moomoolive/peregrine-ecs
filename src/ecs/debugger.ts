import {
    debugComponent,
    ComponentId,
    ComponentDebug
} from "../dataStructures/registries/index"
import {
    ComponentViews
} from "../components/index"

export class Debugger {
    readonly componentClasses: ComponentViews
    readonly componentDebugInfo: ComponentDebug[]
    protected readonly _stringifiedComponentDeclaration: string

    constructor(
        componentClasses: ComponentViews,
        stringifiedComponentDeclaration: string
    ) {
        this.componentClasses = componentClasses
        this._stringifiedComponentDeclaration = stringifiedComponentDeclaration
        this.componentDebugInfo = []
        for (let i = 0; i < componentClasses.length; i++) {
            this.componentDebugInfo.push(
                debugComponent(i, componentClasses)
            )
        } 
    }

    get componentCount(): number {
        return this.componentDebugInfo.length
    }

    get stringifiedComponentDeclaration(): string {
        return this._stringifiedComponentDeclaration
    }

    componentInfo(
        componentId: ComponentId
    ): ComponentDebug {
        return this.componentDebugInfo[componentId as number]
    }

    allComponents(): ComponentDebug[] {
        return this.componentDebugInfo
    }
}