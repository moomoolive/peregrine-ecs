import {
    VecClass, 
    vec,
    StructDef
} from "struct-vec"
import {
    Archetype,
    stdArchetypes
} from "./archetype"
import {
    EntityIndex,
    stdEntities,
    EntityRecord
} from "./entities"


function COMPONENT_ARCHETYPE(): Archetype {
    return Archetype([
        stdEntities.id,
        stdEntities.component,
    ], [])
}
function ID_ARCHETYPE(): Archetype {
    return Archetype([
        stdEntities.id,
        stdEntities.component, 
    ], [])
}

type RegisteredComponents = {
    readonly [_: string]: StructDef
}

type ComponentRegistry<T extends RegisteredComponents> = {
    [key in keyof T]: number
}

function ComponentRegistry<T extends RegisteredComponents>(
    components: T
): ComponentRegistry<T> {
    const keys = Object.keys(components)
    const registry = {}
    for (let i = 0; i < keys.length; i += 1) {
        Object.defineProperty(registry, keys[i], {
            get() {return i}
        })
    }
    return registry as unknown as ComponentRegistry<T>
}

export class Ecs<T extends RegisteredComponents> {
    index: EntityIndex
    archetypes: Archetype[]
    components: VecClass<any>[]
    systems: Function[] = []
    componentRegistry: ComponentRegistry<T>

    constructor(componentsDefs: T) {
        const componentArch = COMPONENT_ARCHETYPE()
        const idArch = ID_ARCHETYPE()
        this.index = EntityIndex([
            EntityRecord(componentArch, 0),
            EntityRecord(idArch, 1)
        ])
        this.archetypes = [idArch, componentArch]
        this.systems = []
        
        this.componentRegistry = ComponentRegistry(componentsDefs)
        
        const componentKeys = Object.keys(componentsDefs)
        const components = []
        for (let i = 0; i < componentKeys.length; i += 1) {
            const name = componentKeys[i]
            const def = componentsDefs[name]
            const componentContainer = vec(def)
            components.push(componentContainer)
        }
        this.components = components
    }
}

const ecs = new Ecs({
    position: {x: "f32", y: "f32", z: "f32"},
    health: {value: "i32"}
})

ecs.componentRegistry.health
