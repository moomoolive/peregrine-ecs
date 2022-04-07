import {Vec} from "struct-vec"

export const enum stdArchetypes {
    id = 0,
    component = 1
}

export type Archetype = {
    entityIds: number[]
    components: Vec<any>[]
}

export function Archetype(
    entityIds: number[],
    components: Vec<any>[]
) {
    return {entityIds, components}
}
