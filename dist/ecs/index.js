"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineEcs = exports.Ecs = void 0;
const index_1 = require("../dataStructures/veci32/index");
const index_2 = require("../dataStructures/registries/index");
const index_3 = require("../components/index");
class Ecs {
    constructor(params) {
        this._unusedEntityIds = new index_1.Veci32(1);
        this._entityRecords = [];
        this._tables = [];
        const { components, componentClasses } = params;
        /* generated via macros */
        this.components = components;
        this.componentClasses = componentClasses;
    }
}
exports.Ecs = Ecs;
function defineEcs(params) {
    const { components: componentDeclaration } = params;
    const componentClasses = (0, index_3.generateComponentClasses)(componentDeclaration);
    const components = (0, index_2.componentRegistryMacro)(componentDeclaration);
    return Function(`(
        Ecs,
        componentClasses,
        components
    ) => {
class GeneratedEcs extends Ecs {
    constructor() {
        super({
            componentClasses,
            components
        })
    }
}
}`)(Ecs, componentClasses, components)();
}
exports.defineEcs = defineEcs;
