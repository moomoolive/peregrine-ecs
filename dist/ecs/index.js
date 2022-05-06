"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineEcs = exports.BaseEcs = void 0;
const index_1 = require("../dataStructures/veci32/index");
const index_2 = require("../dataStructures/registries/index");
const index_3 = require("../components/index");
const debugger_1 = require("./debugger");
const mutator_1 = require("../entities/mutator");
class BaseEcs {
    constructor(params) {
        this._unusedEntityIds = new index_1.Veci32(1);
        this._entityRecords = [];
        this._tables = [];
        const { components, componentClasses } = params;
        /* generated via macros */
        this.components = components;
        this._componentClasses = componentClasses;
        /* ends here */
        this.debugger = new debugger_1.Debugger(this._componentClasses);
        this._mutator = new mutator_1.EntityMutator(this._entityRecords, this._tables);
    }
    updateEntity(entityId) {
        return this._mutator;
    }
}
exports.BaseEcs = BaseEcs;
function defineEcs(params) {
    const { components: componentDeclaration } = params;
    const componentClasses = (0, index_3.generateComponentClasses)(componentDeclaration);
    const components = (0, index_2.componentRegistryMacro)(componentDeclaration);
    return Function(`return (
        BaseEcs, componentClasses, components,
        Debugger
    ) => {
    return class GeneratedEcs extends BaseEcs {
        constructor() {
            super({
                componentClasses,
                components
            })
        }
    }
}`)()(BaseEcs, componentClasses, components, debugger_1.Debugger);
}
exports.defineEcs = defineEcs;
