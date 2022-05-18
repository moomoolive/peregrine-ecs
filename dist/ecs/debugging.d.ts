import { StructProxyClasses, ComponentTokens, ComponentDefinition } from "../components/index";
export declare type ComponentDebug = {
    id: number;
    bytesPerElement: number;
    name: string;
    definition: ComponentTokens;
    stringifiedDef: string;
};
export declare type ComponentId = number | ComponentDefinition;
export declare function generateComponentDebugInfo(componentProxyStructClasses: StructProxyClasses): ComponentDebug[];
//# sourceMappingURL=debugging.d.ts.map