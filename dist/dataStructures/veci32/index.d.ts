export declare class Veci32 {
    static push(vec: Veci32, i32: number): void;
    static pop(vec: Veci32): number | undefined;
    static reserve(vec: Veci32, additional: number): void;
    static shrinkTo(vec: Veci32, minCapacity: number): void;
    memory: Int32Array;
    length: number;
    constructor(capacity: number);
}
//# sourceMappingURL=index.d.ts.map