import { Component, ComponentDef } from "../components/index";
declare class TableWorkerMemory {
    length: number;
    components: Component<ComponentDef>[];
    entities: Int32Array;
    constructor(length: number, components: Component<ComponentDef>[], entities: Int32Array);
}
export declare class Table {
    type: Int32Array;
    removeEdges: Map<number, Table>;
    addEdges: Map<number, Table>;
    workerMemory: TableWorkerMemory;
    constructor();
}
export {};
//# sourceMappingURL=index.d.ts.map