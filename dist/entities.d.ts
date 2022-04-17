import { Archetype } from "./archetypes";
export declare const enum std {
    component = 0,
    id = 0
}
export declare type EntityRecord = {
    archetype: Archetype;
    row: number;
    componentRef: number;
};
export declare function EntityRecord(archetype: Archetype, row: number, componentRef: number): EntityRecord;
//# sourceMappingURL=entities.d.ts.map