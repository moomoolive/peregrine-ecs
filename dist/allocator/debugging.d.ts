import { Types } from "../components/index";
declare const TABLE_ALLOCATOR_NAME = "global_allocator";
export declare type PrettyPtrAddress<AllocatorName extends string, PtrAddress extends number> = `${AllocatorName}[${PtrAddress}]`;
export declare type PtrInfo<AllocatorName extends string, PtrAddress extends number> = {
    rawPtrAddress: PtrAddress;
    prettyPtrAddress: PrettyPtrAddress<AllocatorName, PtrAddress>;
};
export declare type FieldPtrInfo<AllocatorName extends string, FieldPtrAddress extends number> = (PtrInfo<AllocatorName, FieldPtrAddress> & {
    name: string;
    type: Types;
});
export declare type ComponentPtrsDebug = {
    fieldPointers: FieldPtrInfo<typeof TABLE_ALLOCATOR_NAME, number>[];
    componentSegmentsPtr: PtrInfo<typeof TABLE_ALLOCATOR_NAME, number>;
};
export {};
//# sourceMappingURL=debugging.d.ts.map