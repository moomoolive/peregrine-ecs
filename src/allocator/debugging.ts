import {
    ComponentTokens, 
    Types,
} from "../components/index"

const TABLE_ALLOCATOR_NAME = "global_allocator"

export type PrettyPtrAddress<
    AllocatorName extends string,
    PtrAddress extends number
> = `${AllocatorName}[${PtrAddress}]`

function TableAllocatorAddress(
    rawAddress: number
): PrettyPtrAddress<typeof TABLE_ALLOCATOR_NAME, number> {
    return `${TABLE_ALLOCATOR_NAME}[${rawAddress}]`
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
        typeof TABLE_ALLOCATOR_NAME, 
        number
    >[],
    componentSegmentsPtr: PtrInfo<
        typeof TABLE_ALLOCATOR_NAME, 
        number
    >
}

/*
export function debugComponentPtrs(
    ptrs: Int32Array,
    tokens: ComponentTokens
): ComponentPtrsDebug {
    const componentSegmentsPtr = getComponentSegmentsPtr(ptrs)
    const fieldPointers: FieldPtrInfo<
        typeof TABLE_ALLOCATOR_NAME,
        number
    >[] = []
    const len = tokens.length - encoding.component_ptr_size
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
        componentSegmentsPtr: {
            rawPtrAddress: componentSegmentsPtr,
            prettyPtrAddress: globalAllocatorAddress(componentSegmentsPtr)
        }
    }
}
*/