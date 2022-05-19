import {
    Table,
} from "../table/index"
import {
    createDefaultTables,
    standard_tables,
} from "../table/standardTables"
import {
    EntityRecords,
    record_encoding,
    entities_encoding,
    standard_entity,
    relation_entity_encoding
} from "../entities/index"
import {
    componentRegistryMacro,
    ComponentRegistry,
    registry_encoding
} from "../dataStructures/registries/index"
import {
    ComponentsDeclaration,
    StructProxyClasses,
    generateComponentStructProxies,
    deserializeComponentId,
    struct_proxy_encoding
} from "../components/index"
import {
    ComponentDebug,
    generateComponentDebugInfo,
    ComponentId
} from "./debugging"
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
import {
    Allocator, 
    createComponentAllocator
} from "../allocator/index"

export type EcsMode = "development" | "production"

export type EcsOptions = {
    maxEntities: number,
    allocatorInitialMemoryMB: number
    mode: "development" | "production"
}

export class Ecs<
    Components extends ComponentsDeclaration
> {
    static readonly MAX_FIELDS_PER_COMPONENT = struct_proxy_encoding.max_fields
    static readonly MAX_COMPONENTS = registry_encoding.max_components
    static readonly MAX_RELATIONS = relation_entity_encoding.approx_max_count

    /* entity ids & records */
    private unusedEntities: Int32Array
    private unusedEntityCount: number
    private largestEntityId: number
    private entityRecords: EntityRecords

    /* tables (sometimes called archetypes) */
    private tables: Table[]
    private tableAllocator: Allocator
    private hashToTableIndex: Map<string, number>

    /* components */
    readonly components: ComponentRegistry<Components>
    private readonly componentStructProxies: StructProxyClasses
    private componentDebugInfo: ComponentDebug[]
    readonly schemas: Components

    constructor(params: {
        readonly components: Components
    },
    {
        maxEntities = entities_encoding.limit,
        allocatorInitialMemoryMB = 50,
        mode = "development"
    }: Partial<EcsOptions> = {}) {
        const {components} = params
        this.schemas = components
        const {
            proxyClasses,
            orderedComponentNames
        } = generateComponentStructProxies(components)
        this.componentStructProxies = proxyClasses
        this.components = componentRegistryMacro(orderedComponentNames)
        
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

        this.largestEntityId = standard_entity.start_of_user_defined_entities

        this.entityRecords.init()
        const {defaultTables} = createDefaultTables(
            this.tableAllocator,
            this.entityRecords,
            this.componentStructProxies.length
        )
        this.tables = [...defaultTables]
        for (const {id, hash} of defaultTables) {
            this.hashToTableIndex.set(hash, id)
        }
        this.componentDebugInfo = generateComponentDebugInfo(
            this.componentStructProxies
        )
    }

    get entityCount(): number {
        return this.largestEntityId - standard_entity.start_of_user_defined_entities
    }

    get preciseEntityCount(): number {
        return (
            this.entityCount 
            + standard_entity.reserved_count
            + this.componentCount
        )
    }

    get componentCount(): number {
        return this.componentStructProxies.length
    }

    allComponentDebugInfo(): ComponentDebug[] {
        return this.componentDebugInfo
    }

    debugComponent(componentId: ComponentId): ComponentDebug {
        const id = deserializeComponentId(componentId as number)
        return this.componentDebugInfo[id]
    }

    private addToBlankTable(id: number) {
        const blankTable = this.tables[standard_tables.ecs_root_table]
        blankTable.ensureSize(1, this.tableAllocator)
        const row = blankTable.length++ 
        blankTable.entities[row] = id
        this.entityRecords.recordEntity(
            id, row, standard_entity.ecs_root
        )
    }

    newId(): number {
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

    hasId(entityId: number, id: number): boolean {
        const {tableId} = this.entityRecords.index(entityId)
        if (tableId === record_encoding.unintialized) {
            return false
        }
        return this.tables[tableId].has(id)
    }

    isAlive(entityId: number): boolean {
        const {tableId} = this.entityRecords.index(entityId)
        return tableId !== record_encoding.unintialized
    }

    delete(entityId: number): boolean {
        const {tableId, row} = this.entityRecords.index(entityId)
        if (tableId === record_encoding.unintialized) {
            return false
        }
        this.entityRecords.unsetEntity(entityId)
        this.tables[tableId].removeEntity(row)
        /* recycle entity id, stash for later use */
        const unusedSlot = this.unusedEntityCount++
        this.unusedEntities[unusedSlot] = entityId
        return true
    }

    addTag(entityId: number, tagId: number): MutatorStatusCode {
        const entity = this.entityRecords.index(entityId)
        const {tableId, row} = entity
        if (tableId === record_encoding.unintialized) {
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
        entity.tableId = newTable
        entity.row = newRow
        return mutation_status.successful_update
    }
}
