"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.relationRegistryMacro = exports.computeRelationId = exports.componentRegistryMacro = void 0;
const index_1 = require("../../components/index");
const errors_1 = require("../../debugging/errors");
function componentRegistryMacro(componentNames) {
    if (componentNames.length < 1) {
        throw SyntaxError((0, errors_1.err)("component declaration must have at least one component"));
    }
    else if (componentNames.length > 256 /* max_components */) {
        throw SyntaxError((0, errors_1.err)(`too many components, allowed=${256 /* max_components */}, got=${componentNames.length}`));
    }
    const keys = componentNames;
    const registry = {};
    for (let i = 0; i < keys.length; i++) {
        /*
        the component name and fields are sanitized by
        the macro that creates the components classes,
        which runs before this. So there is no need to check
        if fields/component names are correct.
        */
        const entityId = (0, index_1.computeComponentId)(i);
        Object.defineProperty(registry, keys[i], { value: entityId });
    }
    return Object.freeze(registry);
}
exports.componentRegistryMacro = componentRegistryMacro;
function computeRelationId(offset) {
    return offset + 562 /* relations_start */;
}
exports.computeRelationId = computeRelationId;
const STANDARD_RELATIONS = [
    "instanceof"
];
function relationRegistryMacro(relationNames) {
    (0, errors_1.assert)(!Array.isArray(relationNames), `relations must be inputted as an array of strings (got type "${typeof relationNames}")`);
    const relationKeys = (0, index_1.orderKeysByName)([
        ...STANDARD_RELATIONS,
        ...relationNames.slice()
    ]);
    const registry = {};
    for (let i = 0; i < relationKeys.length; i++) {
        /*
        the component name and fields are sanitized by
        the macro that creates the components classes,
        which runs before this. So there is no need to check
        if fields/component names are correct.
        */
        const entityId = computeRelationId(i);
        Object.defineProperty(registry, relationKeys[i], { value: entityId });
    }
    return {
        relations: Object.freeze(registry),
        orderedKeys: relationKeys
    };
}
exports.relationRegistryMacro = relationRegistryMacro;
