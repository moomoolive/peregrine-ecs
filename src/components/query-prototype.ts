import {Component, ComponentDef} from "./index"

const components = {
    position: {
        id: 1,
        def: {x: "i32"}
    },
    velocity: {
        id: 2,
        def: {x: "f32", y: "f32", z: "f32"}
    }
} as const

type QueryHelper = { 
    readonly id: number, 
    readonly def: ComponentDef
}
type QueryParams = ReadonlyArray<QueryHelper>

type Query<T extends QueryParams> = {
    [I in keyof T]: (
        T[I] extends {def: ComponentDef} ? 
            Component<T[I]["def"]> 
            : never
    ) 
}

function fn<T extends QueryParams>(q: T): Query<T> {
    return {} as any
}



const {position, velocity} = components

const q = fn([position, velocity] as const)
