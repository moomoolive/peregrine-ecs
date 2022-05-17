import { ComponentId, ComponentDebug } from "../dataStructures/registries/index";
import { StructProxyClasses, ComponentsDeclaration } from "../components/index";
export declare class Debugger<Components extends ComponentsDeclaration> {
    private componentDebugInfo;
    readonly schemas: Components;
    constructor(componentProxyStructClasses: StructProxyClasses, components: Components);
    get componentCount(): number;
    componentInfo(componentId: ComponentId): ComponentDebug;
    allComponents(): ReadonlyArray<ComponentDebug>;
}
//# sourceMappingURL=debugger.d.ts.map