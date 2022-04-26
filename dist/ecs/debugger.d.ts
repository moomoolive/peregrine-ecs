import { ComponentId, ComponentDebug } from "../dataStructures/registries/index";
import { ComponentsDeclaration } from "../components/index";
import type { Ecs } from "./index";
export declare class Debugger {
    private "@self";
    constructor(self: Ecs<ComponentsDeclaration>);
    componentInfo(componentId: ComponentId): ComponentDebug;
}
//# sourceMappingURL=debugger.d.ts.map