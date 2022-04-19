import { Component, ComponentDef } from "../components/index";
export declare class Archetype {
    type: Int32Array;
    entityIds: Int32Array;
    components: Component<ComponentDef>[];
    length: number;
    edges: ArchetypeEdge[];
    refIndex: number;
    constructor();
}
declare class ArchetypeEdge {
    add: Archetype | null;
    remove: Archetype | null;
    constructor(add: Archetype | null, remove: Archetype | null);
}
export {};
//# sourceMappingURL=index.d.ts.map