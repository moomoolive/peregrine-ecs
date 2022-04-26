import {
    Veci32
} from "../dataStructures/veci32/index"
import {
    Table
} from "../table/index"
import {
    EntityRecord
} from "../entities/index"
import {
    ComponentsDeclaration,
    componentRegistryMacro,
    ComponentRegistry
} from "../dataStructures/registries/index"

export class Ecs<
    T extends ComponentsDeclaration
> {
    /** entity ids that were recycled or not used yet */
    protected _unusedEntityIds: Veci32
    /** which archetype and row an entity resides in */
    protected _entityRecords: EntityRecord[]
    /** a table holds entities that have the exact same components */
    protected _tables: Table[]

    readonly components: ComponentRegistry<T>

    constructor(params: {
        components: ComponentRegistry<T>
    }) {
        this._unusedEntityIds = new Veci32(1)
        this._entityRecords = []
        this._tables = []

        const {components} = params
        /* generated via macros */
        this.components = components
    }
}

export function defineEcs<
    T extends ComponentsDeclaration
>(params: {
    readonly components: T
}): Ecs<T> {
    const {components} = params
    const componentRegistry = componentRegistryMacro(components)
    return Function(`(Ecs, componentRegistry) => {
class GeneratedEcs extends Ecs {
    constructor() {
        super({
            components: componentRegistry
        })
    }
}
}`)(Ecs, componentRegistry)()
}
