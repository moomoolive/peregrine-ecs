import { ComponentId, ComponentDebug } from "../dataStructures/registries/index";
import { StructProxyClasses } from "../components/index";
export declare class Debugger {
    readonly componentClasses: StructProxyClasses;
    readonly componentDebugInfo: ComponentDebug[];
    protected readonly _stringifiedComponentDeclaration: string;
    constructor(componentClasses: StructProxyClasses, stringifiedComponentDeclaration: string);
    get componentCount(): number;
    get stringifiedComponentDeclaration(): string;
    componentInfo(componentId: ComponentId): ComponentDebug;
    allComponents(): ComponentDebug[];
}
//# sourceMappingURL=debugger.d.ts.map