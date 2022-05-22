"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entitiesRegistryMacro = exports.computeEntityId = exports.STANDARD_ENTITIES = exports.relationRegistryMacro = exports.STANDARD_RELATIONS = exports.ENTITY_DECLARATION_TYPES = exports.computeRelationId = exports.componentRegistryMacro = void 0;
const index_1 = require("../../components/index");
const errors_1 = require("../../debugging/errors");
const ids_1 = require("../../entities/ids");
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
        const immutableId = (0, ids_1.makeIdImmutable)(entityId);
        Object.defineProperty(registry, keys[i], { value: immutableId });
    }
    return Object.freeze(registry);
}
exports.componentRegistryMacro = componentRegistryMacro;
function computeRelationId(offset) {
    return offset + 562 /* relations_start */;
}
exports.computeRelationId = computeRelationId;
exports.ENTITY_DECLARATION_TYPES = [
    "immutable",
    "reserved"
];
function correctEntityType(type) {
    switch (type) {
        case "immutable":
        case "reserved":
            return true;
        default:
            return false;
    }
}
function entityRegistryMacro(declaredEntities, registryFor, standardEntities, idComputeFn) {
    if (typeof declaredEntities !== "object" || declaredEntities === null || Array.isArray(declaredEntities)) {
        throw (0, errors_1.incorrectSchema)(`declared ${registryFor} must be an object with string values of ${exports.ENTITY_DECLARATION_TYPES.join(", ")}. Got ${declaredEntities} (type=${typeof declaredEntities}).`);
    }
    const keys = Object.assign(Object.assign({}, standardEntities), declaredEntities);
    const relationKeys = (0, index_1.orderKeysByName)(Object.keys(keys));
    const registry = {};
    for (let i = 0; i < relationKeys.length; i++) {
        const name = relationKeys[i];
        const type = keys[name];
        if (typeof type !== "string" || !correctEntityType(type)) {
            throw (0, errors_1.incorrectSchema)(`declared ${registryFor} "${name}" is an incorrect type (type=${typeof type}, value=${type}). Declared ${registryFor} must be a string value of ${exports.ENTITY_DECLARATION_TYPES.join(", ")}.`);
        }
        const entityId = idComputeFn(i);
        const idWithMeta = type === "immutable" ?
            (0, ids_1.makeIdImmutable)(entityId) : entityId;
        Object.defineProperty(registry, relationKeys[i], { value: idWithMeta });
    }
    return {
        registry: Object.freeze(registry),
        orderedKeys: relationKeys
    };
}
exports.STANDARD_RELATIONS = {
    instanceof: "immutable",
    wildcard: "immutable"
};
function relationRegistryMacro(declaredRelations) {
    return entityRegistryMacro(declaredRelations, "relations", exports.STANDARD_RELATIONS, computeRelationId);
}
exports.relationRegistryMacro = relationRegistryMacro;
exports.STANDARD_ENTITIES = {};
function computeEntityId(offset) {
    return offset + 4095 /* start_of_user_defined_entities */;
}
exports.computeEntityId = computeEntityId;
function entitiesRegistryMacro(declaredRelations) {
    return entityRegistryMacro(declaredRelations, "entities", exports.STANDARD_ENTITIES, computeEntityId);
}
exports.entitiesRegistryMacro = entitiesRegistryMacro;
