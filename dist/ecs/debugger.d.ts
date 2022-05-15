import { ComponentId, ComponentDebug } from "../dataStructures/registries/index";
import { ComponentViews } from "../components/index";
export declare class Debugger {
    readonly componentClasses: ComponentViews;
    readonly componentDebugInfo: ComponentDebug[];
    protected readonly _stringifiedComponentDeclaration: string;
    constructor(componentClasses: ComponentViews, stringifiedComponentDeclaration: string);
    get componentCount(): number;
    get stringifiedComponentDeclaration(): string;
    componentInfo(componentId: ComponentId): ComponentDebug;
    allComponents(): ComponentDebug[];
}
//# sourceMappingURL=debugger.d.ts.map