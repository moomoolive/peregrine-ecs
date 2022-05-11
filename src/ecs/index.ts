import {
    Table
} from "../table/index"
import {
    EntityRecords
} from "../entities/index"
import {
    componentRegistryMacro,
    ComponentRegistry,
} from "../dataStructures/registries/index"
import {
    ComponentsDeclaration,
    ComponentClasses,
    generateComponentClasses,
} from "../components/index"
import {Debugger} from "./debugger"
import {
    EntityMutator,
    encoding as MutatorEncoding
} from "../entities/mutator"
import {
    createSharedInt32Array, 
    createSharedFloat64Array
} from "../dataStructures/sharedArrays"
import {entities, bytes} from "../consts"
import {Allocator, createComponentAllocator} from "../allocator/index"
import {MAX_FIELDS_PER_COMPONENT} from "../components/tokenizeDef"

export class BaseEcs<
    Components extends ComponentsDeclaration
> {
    protected _unusedEntityIds: Int32Array
    protected _entityRecords: EntityRecords
    protected _tables: Table[]
    protected "&tablePtrs": Int32Array
    protected _componentAllocator: Allocator
    protected _mutatorDatabuffer: Float64Array

    /* generated by macros */
    protected readonly _componentClasses: ComponentClasses
    readonly components: ComponentRegistry<Components>
    /* ends here */

    readonly debugger: Debugger
    private _mutator: EntityMutator<Components>

    constructor(params: {
        componentClasses: ComponentClasses,
        componentRegistry: ComponentRegistry<Components>
        maxEntities: number,
        allocatorInitialMemoryMB: number,
        stringifiedComponentDeclaration: string
    }) {
        const {
            componentClasses,
            componentRegistry,
            maxEntities,
            allocatorInitialMemoryMB,
            stringifiedComponentDeclaration
        } = params
        
        this._unusedEntityIds = createSharedInt32Array(maxEntities)
        this["&tablePtrs"] = createSharedInt32Array(5_000)
        this._entityRecords = new EntityRecords(maxEntities)
        this._mutatorDatabuffer = createSharedFloat64Array(
            (10 * (
                MAX_FIELDS_PER_COMPONENT 
                + MutatorEncoding.component_id_size
            )) + MutatorEncoding.entity_id_size
        )
        this._tables = []
        this._componentAllocator = createComponentAllocator(
            bytes.per_megabytes * allocatorInitialMemoryMB, 
            false
        )

        /* generated via macros */
        this.components = componentRegistry
        this._componentClasses = componentClasses
        /* ends here */

        this.debugger = new Debugger(
            this._componentClasses,
            stringifiedComponentDeclaration
        )
        this._mutator = new EntityMutator<Components>(
            this._entityRecords,
            this._tables,
            this._mutatorDatabuffer,
            this["&tablePtrs"]
        )
    }
}

export interface EcsClass<
    Components extends ComponentsDeclaration
> {
    new(): BaseEcs<Components>
}

export function defineEcs<
    Declaration extends ComponentsDeclaration
>(params: {
    readonly components: Declaration
    maxEntities?: number,
    allocatorInitialMemoryMB?: number
}): EcsClass<Declaration> {
    const {
        components: componentDeclaration,
        maxEntities = entities.limit,
        allocatorInitialMemoryMB = 50
    } = params
    const stringifiedComponentDeclaration = JSON.stringify(componentDeclaration)
    const componentClasses = generateComponentClasses(componentDeclaration)
    const componentRegistry = componentRegistryMacro(componentDeclaration)
    return Function(`return (
        BaseEcs, componentClasses, componentRegistry,
        Debugger, EntityMutator, maxEntities,
        allocatorInitialMemoryMB, stringifiedComponentDeclaration
    ) => {
    return class GeneratedEcs extends BaseEcs {
        constructor() {
            super({
                componentClasses,
                maxEntities,
                componentRegistry,
                allocatorInitialMemoryMB,
                stringifiedComponentDeclaration
            })
        }
    }
}`)()(
        BaseEcs, componentClasses, componentRegistry,
        Debugger, EntityMutator, maxEntities,
        allocatorInitialMemoryMB, stringifiedComponentDeclaration
    )
}
