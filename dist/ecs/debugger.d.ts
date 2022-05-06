import { ComponentId, ComponentDebug } from "../dataStructures/registries/index";
import { ComponentDef, ComponentClasses } from "../components/index";
export declare class Debugger {
    readonly componentClasses: ComponentClasses;
    readonly componentCount: number;
    constructor(componentClasses: ComponentClasses);
    componentInfo<T extends ComponentDef>(componentId: ComponentId<T>): ComponentDebug<T>;
    allComponents(): ComponentDebug<ComponentDef>[];
}
//# sourceMappingURL=debugger.d.ts.map