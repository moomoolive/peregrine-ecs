import {
    Table
} from "../table/index"
import {
    createDefaultTables,
    std_tables
} from "../table/standardTables"
import {
    EntityRecords,
    record_encoding,
    entities_encoding,
    standard_entity
} from "../entities/index"
import {
    componentRegistryMacro,
    ComponentRegistry,
} from "../dataStructures/registries/index"
import {
    ComponentsDeclaration,
    StructProxyClasses,
    generateComponentStructProxies,
} from "../components/index"
import {Debugger} from "./debugger"
import {
    mutation_status,
    MutatorStatusCode,
    findTableOrCreate,
    shiftComponentDataAligned
} from "../entities/mutator"
import {
    createSharedInt32Array,
} from "../dataStructures/sharedArrays"
import {bytes} from "../consts"
import {Allocator, createComponentAllocator} from "../allocator/index"
import {MAX_FIELDS_PER_COMPONENT} from "../components/tokenizeDef"

export type EcsMode = "development" | "production"

export type EcsOptions = {
    maxEntities: number,
    allocatorInitialMemoryMB: number
    mode: "development" | "production"
}

export class Ecs<
    Components extends ComponentsDeclaration
> {
    private unusedEntities: Int32Array
    private unusedEntityCount: number

    private entityRecords: EntityRecords
    private tables: Table[]
    private tableAllocator: Allocator
    private hashToTableIndex: Map<string, number>

    private readonly componentStructProxies: StructProxyClasses

    private largestEntityId: number

    readonly debug: Debugger<Components>
    readonly components: ComponentRegistry<Components>

    constructor(params: {
        readonly components: Components
    },
    {
        maxEntities = entities_encoding.limit,
        allocatorInitialMemoryMB = 50,
        mode = "development"
    }: Partial<EcsOptions> = {}) {
        const {components} = params

        this.components = componentRegistryMacro(components)
        this.unusedEntities = createSharedInt32Array(maxEntities)
        this.unusedEntityCount = 0
        
        this.entityRecords = new EntityRecords(
            maxEntities > entities_encoding.minimum ?
                maxEntities
                : entities_encoding.minimum
        )
        
        this.tableAllocator = createComponentAllocator(
            bytes.per_megabyte * allocatorInitialMemoryMB, 
            false
        )

        this.hashToTableIndex = new Map()

        this.componentStructProxies = generateComponentStructProxies(
            components
        )

        this.largestEntityId = standard_entity.start_of_user_defined_entities

        this.debug = new Debugger(
            this.componentStructProxies,
            components
        )

        this.entityRecords.init()
        this.tables = [
            ...createDefaultTables(
                this.tableAllocator,
                this.entityRecords,
                this.componentStructProxies.length
            )
        ]
    }

    get entityCount(): number {
        return this.largestEntityId + 1
    }

    private addToBlankTable(id: number) {
        const blankTable = this.tables[std_tables.ecs_id]
        const length = blankTable.ensureSize(1, this.tableAllocator)
        const row = length - 1
        blankTable.entities[row] = id
        this.entityRecords.allocateEntity(
            id, row, standard_entity.ecs_id
        )
    }

    newEntity(): number {
        if (this.unusedEntityCount < 1) {
            const id = this.largestEntityId++
            this.addToBlankTable(id)
            return id
        }
        const index = --this.unusedEntityCount
        const id = this.unusedEntities[index]
        this.addToBlankTable(this.unusedEntities[index])
        return id
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
        const targetTableId = table.addEdges.get(tagId)
        const allocator = this.tableAllocator
        const targetTable = targetTableId !== undefined ?
            tables[targetTableId] : findTableOrCreate(
                this.hashToTableIndex, table, tagId,
                tables, allocator, this.componentStructProxies
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
