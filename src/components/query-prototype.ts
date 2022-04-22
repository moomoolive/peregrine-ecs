import {Component, ComponentDef} from "./index"

const components = {
    position: {
        id: 1,
        def: () => ({x: "i32"} as const)
    },
    velocity: {
        id: 2,
        def: () => ({x: "f32", y: "f32", z: "f32"} as const)
    }
} as const

type QueryParams = ReadonlyArray<{ 
    readonly id: number, 
    readonly def: () => Readonly<ComponentDef>
}>

// this beautiful generic was made with the help of
// this answer: https://stackoverflow.com/questions/71931020/creating-a-readonly-array-from-another-readonly-array/71933754#71933754
type Query<T extends QueryParams> = {
    [I in keyof T]: (
        T[I] extends {def: () => ComponentDef} ? 
            Component<ReturnType<T[I]["def"]>> 
            : never
    ) 
}

function fn<T extends QueryParams>(q: T): Query<T> {
    return {} as any
}



const {position, velocity} = components

// works
const q = fn([position, velocity] as const)[1]
