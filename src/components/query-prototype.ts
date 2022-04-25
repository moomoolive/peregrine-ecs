import {Component, ComponentDef} from "./index"

type CX = {
    readonly position: number | {x: "i32"}
    readonly velocity: number | {x: "f32", y: "f32", z: "f32"}
}

const comps: CX = {
    position: 1,
    velocity: 2
}

type QueryParams = ReadonlyArray<number | ComponentDef>

// this beautiful generic was made with the help of
// this answer: https://stackoverflow.com/questions/71931020/creating-a-readonly-array-from-another-readonly-array/71933754#71933754
type Query<T extends QueryParams> = {
    [I in keyof T]: (
        T[I] extends number | ComponentDef ? 
            Component<Exclude<T[I], number>> 
            : never
    ) 
}

function fn<T extends QueryParams>(q: T): Query<T> {
    return {} as any
}

// works
const q = fn([comps.position, comps.velocity] as const)[1]
