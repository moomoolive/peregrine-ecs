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
        const { componentClasses, componentRegistry, maxEntities, allocatorInitialMemoryMB, stringifiedComponentDeclaration } = params;
        this._unusedEntityIds = (0, sharedArrays_1.createSharedInt32Array)(maxEntities);
        this["&tablePtrs"] = (0, sharedArrays_1.createSharedInt32Array)(5000);
        this._entityRecords = new index_1.EntityRecords(maxEntities);
        this._mutatorDatabuffer = (0, sharedArrays_1.createSharedFloat64Array)((10 * (tokenizeDef_1.MAX_FIELDS_PER_COMPONENT
            + 1 /* component_id_size */)) + 1 /* entity_id_size */);
        this._tables = [];
        this._componentAllocator = (0, index_4.createComponentAllocator)(1048576 /* per_megabytes */ * allocatorInitialMemoryMB, false);
        /* generated via macros */
        this.components = componentRegistry;
        this._componentClasses = componentClasses;
        /* ends here */
        this.debugger = new debugger_1.Debugger(this._componentClasses, stringifiedComponentDeclaration);
        this._mutator = new mutator_1.EntityMutator(this._entityRecords, this._tables, this._mutatorDatabuffer, this["&tablePtrs"]);
    }
}
exports.BaseEcs = BaseEcs;
function defineEcs(params) {
    const { components: componentDeclaration, maxEntities = 500000 /* limit */, allocatorInitialMemoryMB = 50 } = params;
    const stringifiedComponentDeclaration = JSON.stringify(componentDeclaration);
    const componentClasses = (0, index_3.generateComponentClasses)(componentDeclaration);
    const componentRegistry = (0, index_2.componentRegistryMacro)(componentDeclaration);
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
}`)()(BaseEcs, componentClasses, componentRegistry, debugger_1.Debugger, mutator_1.EntityMutator, maxEntities, allocatorInitialMemoryMB, stringifiedComponentDeclaration);
}
exports.defineEcs = defineEcs;
