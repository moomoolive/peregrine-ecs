import {
    debugComponent,
    ComponentId,
    ComponentDebug
} from "../dataStructures/registries/index"
import {
    ComponentClasses
} from "../components/index"

export class Debugger {
    readonly componentClasses: ComponentClasses
    readonly componentDebugInfo: ComponentDebug[]
    protected readonly _stringifiedComponentDeclaration: string

    constructor(
        componentClasses: ComponentClasses,
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