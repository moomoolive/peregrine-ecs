"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineEcs = exports.BaseEcs = void 0;
const index_1 = require("../entities/index");
const index_2 = require("../dataStructures/registries/index");
const index_3 = require("../components/index");
const debugger_1 = require("./debugger");
const mutator_1 = require("../entities/mutator");
const sharedArrays_1 = require("../dataStructures/sharedArrays");
const index_4 = require("../allocator/index");
const tokenizeDef_1 = require("../components/tokenizeDef");
class BaseEcs {
    constructor(params) {
        const { maxEntities, allocatorInitialMemoryMB, stringifiedComponentDeclaration } = params;
        this._unusedEntityIds = (0, sharedArrays_1.createSharedInt32Array)(maxEntities);
        this._entityRecords = new index_1.EntityRecords(maxEntities);
        this._mutatorDatabuffer = (0, sharedArrays_1.createSharedFloat64Array)((10 * (tokenizeDef_1.MAX_FIELDS_PER_COMPONENT
            + 1 /* component_id_size */)) + 1 /* entity_id_size */);
        this.tables = [];
        this.tableAllocator = (0, index_4.createComponentAllocator)(1048576 /* per_megabyte */ * allocatorInitialMemoryMB, false);
        this.hashToTableIndex = new Map();
        this.componentViews = (0, index_3.generateComponentViewClasses)(JSON.parse(stringifiedComponentDeclaration));
        this.debugger = new debugger_1.Debugger(this.componentViews, stringifiedComponentDeclaration);
        this._mutator = new mutator_1.EntityMutator(this._entityRecords, this.tables, this._mutatorDatabuffer, this.hashToTableIndex, this.tableAllocator, this.componentViews);
    }
}
exports.BaseEcs = BaseEcs;
function defineEcs(params) {
    const { components: componentDeclaration, maxEntities = 500000 /* limit */, allocatorInitialMemoryMB = 50 } = params;
    const componentRegistry = (0, index_2.componentRegistryMacro)(componentDeclaration);
    class GeneratedEcs extends BaseEcs {
        constructor() {
            super({
                maxEntities,
                allocatorInitialMemoryMB,
                stringifiedComponentDeclaration: JSON.stringify(componentDeclaration)
            });
            this.components = componentRegistry;
        }
    }
    GeneratedEcs.componentSchemas = componentDeclaration;
    return GeneratedEcs;
}
exports.defineEcs = defineEcs;
