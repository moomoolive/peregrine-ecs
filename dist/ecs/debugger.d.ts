import { ComponentId, ComponentDebug } from "../dataStructures/registries/index";
import { ComponentClasses } from "../components/index";
export declare class Debugger {
    readonly componentClasses: ComponentClasses;
    readonly componentDebugInfo: ComponentDebug[];
    protected readonly _stringifiedComponentDeclaration: string;
    constructor(componentClasses: ComponentClasses, stringifiedComponentDeclaration: string);
    get componentCount(): number;
    get stringifiedComponentDeclaration(): string;
    componentInfo(componentId: ComponentId): ComponentDebug;
    allComponents(): ComponentDebug[];
}
//# sourceMappingURL=debugger.d.ts.map