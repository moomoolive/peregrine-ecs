"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugComponent = exports.componentRegistryMacro = exports.MAX_COMPONENTS = void 0;
const errors_1 = require("../../debugging/errors");
exports.MAX_COMPONENTS = 256;
function componentRegistryMacro(declartion) {
    const keys = Object.keys(declartion);
    if (keys.length < 1) {
        throw SyntaxError((0, errors_1.err)("component declaration must have at least one component"));
    }
    else if (keys.length > exports.MAX_COMPONENTS) {
        throw SyntaxError((0, errors_1.err)(`too many components, allowed=${exports.MAX_COMPONENTS}, got=${keys.length}`));
    }
    const registry = {};
    for (let i = 0; i < keys.length; i++) {
        /*
        the component name and fields are sanitized by
        the macro that creates the components classes,
        which runs before this. So there is no need to check
        if fields/component names are correct.
        */
        Object.defineProperty(registry, keys[i], { value: i });
    }
    return Object.freeze(registry);
}
exports.componentRegistryMacro = componentRegistryMacro;
function debugComponent(component, ComponentViews) {
    const componentClass = ComponentViews[component];
    const { name, bytesPerElement, tokens, stringifiedDefinition } = componentClass;
    return {
        definition: tokens,
        bytesPerElement,
        name,
        stringifiedDef: stringifiedDefinition,
        id: component
    };
}
exports.debugComponent = debugComponent;
