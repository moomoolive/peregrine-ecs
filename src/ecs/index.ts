import {
    Table
} from "../table/index"
import {
    createDefaultTables
} from "../table/standardTables"
import {
    EntityRecords,
    record_encoding
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
    encoding as MutatorEncoding,
    mutation_status,
    MutatorStatusCode,
    findTableOrCreate,
    shiftComponentDataAligned
} from "../entities/mutator"
import {
    createSharedInt32Array, 
    createSharedFloat64Array
} from "../dataStructures/sharedArrays"
import {entities, bytes} from "../consts"
import {Allocator, createComponentAllocator} from "../allocator/index"
import {MAX_FIELDS_PER_COMPONENT} from "../components/tokenizeDef"
import {sleep} from "../utils"

export type EcsMode = "development" | "production"

export class BaseEcs {
    protected unusedEntities: Int32Array
    protected unusedEntityCount: number

    protected entityRecords: EntityRecords
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
        stringifiedComponentDeclaration: string,
        mode: EcsMode
    }) {
        const {
            maxEntities,
            allocatorInitialMemoryMB,
            stringifiedComponentDeclaration
        } = params
        
        this.unusedEntities = createSharedInt32Array(maxEntities)
        this.unusedEntityCount = 0
        
        this.entityRecords = new EntityRecords(maxEntities)
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
            this.entityRecords,
            this.tables,
            this._mutatorDatabuffer,
            this.hashToTableIndex,
            this.tableAllocator,
            this.componentViews
        )
    }

    async init() {
        this.entityRecords.records.fill(
            record_encoding.unintialized
        )
        await sleep(0)
        this.tables.push(
            ...createDefaultTables(
                this.tableAllocator,
                this.entityRecords,
                this.debugger.componentCount
            )
        )
    }

    addTag(entityId: number, tagId: number): MutatorStatusCode {
        const entity = this.entityRecords.index(entityId)
        const {table: tableId, row} = entity
        if (row === record_encoding.unintialized) {
            return mutation_status.entity_uninitialized
        }
        const tables = this.tables
        const table = tables[tableId]
        if (table.componentIndexes.has(tagId)) {
            return mutation_status.tag_exists
        }
        const graphTable = table.addEdges.get(tagId)
        const allocator = this.tableAllocator
        const targetTable = graphTable !== undefined ?
            tables[graphTable] : findTableOrCreate(
                this.hashToTableIndex, table, tagId,
                tables, allocator, this.componentViews
            )
        const newTable = targetTable.id
        // proceed to move entity data from current table to 
        // target table, (identical components, tags + new)
        const newRow = shiftComponentDataAligned(
            table, targetTable, row, allocator
        )
        entity.table = newTable
        entity.row = newRow
        return mutation_status.successful_update
    }
}

export type Ecs<
    Components extends ComponentsDeclaration
> = (
    BaseEcs
    & {
        readonly components: ComponentRegistry<Components>
        readonly componentSchemas: Components
    }
)

export function defineEcs<
    Components extends ComponentsDeclaration
>(
    params: {
        readonly components: Components
    },
    {
        maxEntities = entities.limit,
        allocatorInitialMemoryMB = 50,
        mode = "development"
    }: {
        maxEntities?: number,
        allocatorInitialMemoryMB?: number
        mode?: EcsMode
    } = {}
): Ecs<Components> {
    const {
        components: componentDeclaration,
    } = params
    const componentRegistry = componentRegistryMacro(componentDeclaration)
    const frozenDeclartion = Object.freeze(
        JSON.parse(JSON.stringify(componentDeclaration))
    )
    
    class GeneratedEcs extends BaseEcs {
        readonly components: ComponentRegistry<Components>
        
        constructor() {
            super({
                maxEntities,
                allocatorInitialMemoryMB,
                stringifiedComponentDeclaration: JSON.stringify(
                    componentDeclaration
                ),
                mode
            })
            this.components = componentRegistry
        }

        get componentSchemas() {
            return frozenDeclartion
        }
    }
    
    return new GeneratedEcs()
}
