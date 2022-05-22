import {
    Table,
} from "../table/index"
import {
    createDefaultTables,
    standard_tables,
} from "../table/standardTables"
import {
    entities_encoding,
    standard_entity,
    relation_entity_encoding,
} from "../entities/index"
import {
    EntityIndex,
    entityIsInitialized
} from "../entities/records"
import {
    componentRegistryMacro,
    ComponentRegistry,
    registry_encoding,
    relationRegistryMacro,
    RelationRegisty,
    IdDeclaration,
    EntityRegistry,
    entitiesRegistryMacro
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
    entity_mutation_status,
    EntityMutationStatus,
    findTableOrCreate,
    shiftComponentDataAligned,
    findTableOrCreateRemoveHash
} from "../entities/mutations"
import {
    createSharedInt32Array,
} from "../dataStructures/sharedArrays"
import {bytes} from "../consts"
import {
    Allocator, 
    createComponentAllocator
} from "../allocator/index"
import {
    createId,
    stripIdMeta,
    isComponent,
    isImmutable
} from "../entities/ids"
import {assertion} from "../debugging/errors"

export class Ecs<
    Components extends ComponentsDeclaration,
    Relations extends IdDeclaration,
    Entities extends IdDeclaration,
> {
    static readonly MAX_FIELDS_PER_COMPONENT = struct_proxy_encoding.max_fields
    static readonly MAX_COMPONENTS = registry_encoding.max_components
    static readonly MAX_RELATIONS = relation_entity_encoding.approx_max_count

    /* entity ids & records */
    private unusedIndexes: Int32Array
    private unusedIndexesCount: number
    private largestIndex: number
    private records: EntityIndex
    readonly entities: EntityRegistry<Entities>
    readonly declaredEntities: Entities

    /* relations */
    readonly relations: RelationRegisty<Relations>
    readonly declaredRelations: Relations
    readonly relationsCount: number

    /* tables (sometimes called archetypes) */
    private tables: Table[]
    private tableAllocator: Allocator
    private hashToTableIndex: Map<string, number>

    /* components */
    readonly components: ComponentRegistry<Components>
    private readonly componentStructProxies: StructProxyClasses
    private componentDebugInfo: ComponentDebug[]
    readonly declaredComponents: Components

    constructor(params: {
        readonly components: Components,
        readonly relations?: Relations,
        readonly entities?: Entities,
        maxEntities?: number
        allocatorInitialMemoryMB?: number,
        mode?: "development" | "production"
    }) {
        const {
            components, 
            relations = {} as Relations,
            entities = {} as Entities,
            maxEntities = entities_encoding.limit,
            allocatorInitialMemoryMB = 50,
            mode = "development"
        } = params
        this.declaredComponents = components
        const {
            proxyClasses,
            orderedComponentNames
        } = generateComponentStructProxies(components)
        this.componentStructProxies = proxyClasses
        this.components = componentRegistryMacro(orderedComponentNames)
        const {
            registry: generatedRelations,
            orderedKeys: relationKeys
        } = relationRegistryMacro(relations)
        this.relations = generatedRelations
        this.declaredRelations = relations
        this.relationsCount = relationKeys.length

        const {
            registry: generatedEntites,
            orderedKeys: entityKeys
        } = entitiesRegistryMacro(entities)
        this.entities = generatedEntites
        this.declaredEntities = entities

        this.unusedIndexes = createSharedInt32Array(maxEntities)
        this.unusedIndexesCount = 0
        
        if (maxEntities < entities_encoding.minimum) {
            throw assertion(`max entities must be ${entities_encoding.minimum.toLocaleString("en-us")} or greater (got ${maxEntities.toLocaleString("en-us")})`)
        }

        this.records = new EntityIndex(maxEntities)
        
        this.tableAllocator = createComponentAllocator(
            bytes.per_megabyte * allocatorInitialMemoryMB, 
            false
        )

        this.hashToTableIndex = new Map()

        this.largestIndex = (
            standard_entity.start_of_user_defined_entities
            + entityKeys.length
        )

        this.records.init()
        const {defaultTables} = createDefaultTables(
            this.tableAllocator,
            this.records,
            this.componentCount,
            this.relationsCount,
            entityKeys.length
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
        return (
            this.largestIndex 
            - standard_entity.start_of_user_defined_entities
        )
    }

    get componentCount(): number {
        return this.componentStructProxies.length
    }

    private addToRootTable(id: number) {
        const rootTable = this.tables[standard_tables.ecs_root_table]
        rootTable.ensureSize(1, this.tableAllocator)
        const row = rootTable.length++ 
        rootTable.entities[row] = id
        const generationCount = this.records.recordEntity(
            id, row, standard_entity.ecs_root
        )
        return generationCount
    }

    newId(): number {
        if (this.unusedIndexesCount < 1) {
            const index = this.largestIndex++
            const generation = this.addToRootTable(index)
            return createId(index, generation)
        }
        const index = --this.unusedIndexesCount
        const id = this.unusedIndexes[index]
        const generation = this.addToRootTable(this.unusedIndexes[index])
        return createId(id, generation)
    }

    hasId(entityId: number, id: number): boolean {
        const originalId = stripIdMeta(entityId)
        const {tableId, generationCount} = this.records.index(originalId)
        if (!entityIsInitialized(tableId, generationCount, entityId)) {
            return false
        }
        return this.tables[tableId].has(id)
    }

    isAlive(entityId: number): boolean {
        const originalId = stripIdMeta(entityId)
        const {tableId, generationCount} = this.records.index(originalId)
        return entityIsInitialized(tableId, generationCount, entityId)
    }

    addId(entityId: number, tagId: number): EntityMutationStatus {
        if (isImmutable(entityId)) {
            return entity_mutation_status.entity_immutable
        }
        const originalId = stripIdMeta(entityId)
        const entity = this.records.index(originalId)
        const {tableId, row, generationCount} = entity
        if (!entityIsInitialized(tableId, generationCount, entityId)) {
            return entity_mutation_status.entity_uninitialized
        }
        const tables = this.tables
        const table = tables[tableId]
        if (table.componentIndexes.has(tagId)) {
            return entity_mutation_status.tag_exists
        }
        const targetTableId = table.addEdges.get(tagId)
        const allocator = this.tableAllocator
        const targetTable = targetTableId !== undefined ?
            tables[targetTableId] : findTableOrCreate(
                this.hashToTableIndex, table, tagId,
                tables, allocator
            )
        const newTable = targetTable.id
        // proceed to move entity data from current table to 
        // target table, (identical components, tags + new)
        const newRow = shiftComponentDataAligned(
            table, targetTable, row, allocator
        )
        entity.tableId = newTable
        entity.row = newRow
        return entity_mutation_status.successful_added
    }

    removeId(entityId: number, tagId: number): EntityMutationStatus {
        if (isImmutable(entityId)) {
            return entity_mutation_status.entity_immutable
        }
        const originalId = stripIdMeta(entityId)
        const entity = this.records.index(originalId)
        const {tableId, row, generationCount} = entity
        if (!entityIsInitialized(tableId, generationCount, entityId)) {
            return entity_mutation_status.entity_uninitialized
        }
        const tables = this.tables
        const table = tables[tableId]
        if (!table.componentIndexes.has(tagId)) {
            return entity_mutation_status.tag_not_found
        }
        const targetTableId = table.removeEdges.get(tagId)
        const allocator = this.tableAllocator
        const targetTable = targetTableId !== undefined ?
            tables[targetTableId] : findTableOrCreateRemoveHash(
                this.hashToTableIndex, table, tagId,
                tables, allocator
            )
        const newTable = targetTable.id
        const newRow = shiftComponentDataAligned(
            table, targetTable, row, allocator
        )
        entity.tableId = newTable
        entity.row = newRow
        return entity_mutation_status.successfully_removed
    }

    delete(entityId: number): EntityMutationStatus {
        if (isImmutable(entityId)) {
            return entity_mutation_status.entity_immutable
        }
        const originalId = stripIdMeta(entityId)
        const {tableId, row, generationCount} = this.records.index(originalId)
        if (!entityIsInitialized(tableId, generationCount, entityId)) {
            return entity_mutation_status.entity_uninitialized
        }
        this.records.unsetEntity(originalId)
        this.tables[tableId].removeEntity(row)
        /* recycle entity id, stash for later use */
        const unusedSlot = this.unusedIndexesCount++
        this.unusedIndexes[unusedSlot] = originalId
        return entity_mutation_status.successfully_deleted
    }

    /* debugging tools */

    "~all_components_info"(): ComponentDebug[] {
        return this.componentDebugInfo
    }

    "~debug_component"(componentId: ComponentId): ComponentDebug {
        const baseId = stripIdMeta(componentId as number)
        if (!isComponent(baseId)) {
            throw assertion(`inputted id is not a component (got ${componentId.toLocaleString("en-us")})`)
        }
        const id = deserializeComponentId(baseId)
        return this.componentDebugInfo[id]
    }

    "~entity_index"(entityId: number): {
        table: number,
        index: number,
        row: number
        id: number
    } {
        const originalId = stripIdMeta(entityId)
        const {
            tableId,
            row,
        } = this.records.index(originalId)
        return {
            id: entityId,
            table: tableId, 
            row, 
            index: originalId
        }
    }

    get "~preciseEntityCount"(): number {
        return (
            this.entityCount 
            + standard_entity.reserved_count
            + this.componentCount
            + this.relationsCount
        )
    }
}
