"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentRegistryMacro = exports.computeComponentId = exports.MAX_COMPONENTS = void 0;
const errors_1 = require("../../debugging/errors");
exports.MAX_COMPONENTS = 256 /* max_components */;
function computeComponentId(offset) {
    return offset + 50 /* reserved_end */;
}
exports.computeComponentId = computeComponentId;
function componentRegistryMacro(declartion) {
    const componentNames = Object.keys(declartion);
    if (componentNames.length < 1) {
        throw SyntaxError((0, errors_1.err)("component declaration must have at least one component"));
    }
    else if (componentNames.length > 256 /* max_components */) {
        throw SyntaxError((0, errors_1.err)(`too many components, allowed=${exports.MAX_COMPONENTS}, got=${componentNames.length}`));
    }
    /* order names alphabetically */
    const keys = componentNames.slice().sort();
    const registry = {};
    for (let i = 0; i < keys.length; i++) {
        /*
        the component name and fields are sanitized by
        the macro that creates the components classes,
        which runs before this. So there is no need to check
        if fields/component names are correct.
        */
        const entityId = computeComponentId(i);
        Object.defineProperty(registry, keys[i], { value: entityId });
    }
    return Object.freeze(registry);
}
exports.componentRegistryMacro = componentRegistryMacro;
