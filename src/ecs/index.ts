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
    ComponentViews,
    generateComponentViewClasses,
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

export class BaseEcs {
    protected _unusedEntityIds: Int32Array
    protected _entityRecords: EntityRecords
    protected tables: Table[]
    protected tableAllocator: Allocator
    protected _mutatorDatabuffer: Float64Array
    protected hashToTableIndex: Map<string, number>

    protected readonly componentViews: ComponentViews

    readonly debugger: Debugger
    private _mutator: EntityMutator<ComponentsDeclaration>

    constructor(params: {
        maxEntities: number,
        allocatorInitialMemoryMB: number,
        stringifiedComponentDeclaration: string
    }) {
        const {
            maxEntities,
            allocatorInitialMemoryMB,
            stringifiedComponentDeclaration
        } = params
        
        this._unusedEntityIds = createSharedInt32Array(maxEntities)
        this._entityRecords = new EntityRecords(maxEntities)
        this._mutatorDatabuffer = createSharedFloat64Array(
            (10 * (
                MAX_FIELDS_PER_COMPONENT 
                + MutatorEncoding.component_id_size
            )) + MutatorEncoding.entity_id_size
        )
        this.tables = []
        this.tableAllocator = createComponentAllocator(
            bytes.per_megabyte * allocatorInitialMemoryMB, 
            false
        )
        this.hashToTableIndex = new Map()

        this.componentViews = generateComponentViewClasses(
            JSON.parse(stringifiedComponentDeclaration)
        )

        this.debugger = new Debugger(
            this.componentViews,
            stringifiedComponentDeclaration
        )
        this._mutator = new EntityMutator(
            this._entityRecords,
            this.tables,
            this._mutatorDatabuffer,
            this.hashToTableIndex,
            this.tableAllocator,
            this.componentViews
        )
    }
}

export type GeneratedEcs<
    Components extends ComponentsDeclaration
> = (
    BaseEcs
    & {
        readonly components: ComponentRegistry<Components>
    }
)

export type EcsClass<
    Components extends ComponentsDeclaration
> = {
    readonly componentSchemas: Components
    new(): GeneratedEcs<Components>
}

export function defineEcs<
    Components extends ComponentsDeclaration
>(params: {
    readonly components: Components
    maxEntities?: number,
    allocatorInitialMemoryMB?: number
}): EcsClass<Components> {
    const {
        components: componentDeclaration,
        maxEntities = entities.limit,
        allocatorInitialMemoryMB = 50
    } = params
    const componentRegistry = componentRegistryMacro(componentDeclaration)
    
    class GeneratedEcs extends BaseEcs {
        static readonly componentSchemas = componentDeclaration

        readonly components: ComponentRegistry<Components>
        
        constructor() {
            super({
                maxEntities,
                allocatorInitialMemoryMB,
                stringifiedComponentDeclaration: JSON.stringify(
                    componentDeclaration
                )
            })
            this.components = componentRegistry
        }
    }
    
    return GeneratedEcs
}
