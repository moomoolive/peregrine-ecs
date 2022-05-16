"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineEcs = exports.BaseEcs = void 0;
const standardTables_1 = require("../table/standardTables");
const index_1 = require("../entities/index");
const index_2 = require("../dataStructures/registries/index");
const index_3 = require("../components/index");
const debugger_1 = require("./debugger");
const mutator_1 = require("../entities/mutator");
const sharedArrays_1 = require("../dataStructures/sharedArrays");
const index_4 = require("../allocator/index");
const tokenizeDef_1 = require("../components/tokenizeDef");
const utils_1 = require("../utils");
class BaseEcs {
    constructor(params) {
        const { maxEntities, allocatorInitialMemoryMB, stringifiedComponentDeclaration } = params;
        this.unusedEntities = (0, sharedArrays_1.createSharedInt32Array)(maxEntities);
        this.unusedEntityCount = 0;
        this.entityRecords = new index_1.EntityRecords(maxEntities);
        this._mutatorDatabuffer = (0, sharedArrays_1.createSharedFloat64Array)((10 * (tokenizeDef_1.MAX_FIELDS_PER_COMPONENT
            + 1 /* component_id_size */)) + 1 /* entity_id_size */);
        this.tables = [];
        this.tableAllocator = (0, index_4.createComponentAllocator)(1048576 /* per_megabyte */ * allocatorInitialMemoryMB, false);
        this.hashToTableIndex = new Map();
        this.componentViews = (0, index_3.generateComponentViewClasses)(JSON.parse(stringifiedComponentDeclaration));
        this.debugger = new debugger_1.Debugger(this.componentViews, stringifiedComponentDeclaration);
        this._mutator = new mutator_1.EntityMutator(this.entityRecords, this.tables, this._mutatorDatabuffer, this.hashToTableIndex, this.tableAllocator, this.componentViews);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.entityRecords.records.fill(-1 /* unintialized */);
            yield (0, utils_1.sleep)(0);
            this.tables.push(...(0, standardTables_1.createDefaultTables)(this.tableAllocator, this.entityRecords, this.debugger.componentCount));
        });
    }
    addTag(entityId, tagId) {
        const entity = this.entityRecords.index(entityId);
        const { table: tableId, row } = entity;
        if (row === -1 /* unintialized */) {
            return 1 /* entity_uninitialized */;
        }
        const tables = this.tables;
        const table = tables[tableId];
        if (table.componentIndexes.has(tagId)) {
            return 2 /* tag_exists */;
        }
        const graphTable = table.addEdges.get(tagId);
        const allocator = this.tableAllocator;
        const targetTable = graphTable !== undefined ?
            tables[graphTable] : (0, mutator_1.findTableOrCreate)(this.hashToTableIndex, table, tagId, tables, allocator, this.componentViews);
        const newTable = targetTable.id;
        // proceed to move entity data from current table to 
        // target table, (identical components, tags + new)
        const newRow = (0, mutator_1.shiftComponentDataAligned)(table, targetTable, row, allocator);
        entity.table = newTable;
        entity.row = newRow;
        return 0 /* successful_update */;
    }
}
exports.BaseEcs = BaseEcs;
function defineEcs(params, { maxEntities = 500000 /* limit */, allocatorInitialMemoryMB = 50, mode = "development" } = {}) {
    const { components: componentDeclaration, } = params;
    const componentRegistry = (0, index_2.componentRegistryMacro)(componentDeclaration);
    const frozenDeclartion = Object.freeze(JSON.parse(JSON.stringify(componentDeclaration)));
    class GeneratedEcs extends BaseEcs {
        constructor() {
            super({
                maxEntities,
                allocatorInitialMemoryMB,
                stringifiedComponentDeclaration: JSON.stringify(componentDeclaration),
                mode
            });
            this.components = componentRegistry;
        }
        get componentSchemas() {
            return frozenDeclartion;
        }
    }
    return new GeneratedEcs();
}
exports.defineEcs = defineEcs;
