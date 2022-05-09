import {ComponentTokens, Types} from "../components/index"

const GLOBAL_ALLOCATOR_NAME = "global_allocator"

export type PrettyPtrAddress<
    AllocatorName extends string,
    PtrAddress extends number
> = `${AllocatorName}[${PtrAddress}]`

function globalAllocatorAddress(
    rawAddress: number
): PrettyPtrAddress<typeof GLOBAL_ALLOCATOR_NAME, number> {
    return `${GLOBAL_ALLOCATOR_NAME}[${rawAddress}]`
}

export type PtrInfo<
    AllocatorName extends string,
    PtrAddress extends number
> = {
    rawPtrAddress: PtrAddress,
    prettyPtrAddress: PrettyPtrAddress<AllocatorName, PtrAddress>,
}

export type FieldPtrInfo<
    AllocatorName extends string,
    FieldPtrAddress extends number
> = (
    PtrInfo<AllocatorName, FieldPtrAddress>
    & {
        name: string,
        type: Types
    }
)

export type ComponentPtrsDebug = {
    fieldPointers: FieldPtrInfo<
        typeof GLOBAL_ALLOCATOR_NAME, 
        number
    >[],
    basePointer: PtrInfo<
        typeof GLOBAL_ALLOCATOR_NAME, 
        number
    >
}

export function debugComponentPtrs(
    ptrs: Int32Array,
    tokens: ComponentTokens
): ComponentPtrsDebug {
    const basePointer = ptrs[ptrs.length - 1]
    const fieldPointers: FieldPtrInfo<
        typeof GLOBAL_ALLOCATOR_NAME,
        number
    >[] = []
    const len = tokens.length
    for (let i = 0; i < len; i++) {
        const {name, ptrOffset, type} = tokens[i]
        const rawPtrAddress = ptrs[ptrOffset]
        fieldPointers.push({
            rawPtrAddress,
            prettyPtrAddress: globalAllocatorAddress(rawPtrAddress),
            name,
            type
        })
    }
    return {
        fieldPointers,
        basePointer: {
            rawPtrAddress: basePointer,
            prettyPtrAddress: globalAllocatorAddress(basePointer)
        }
    }
}