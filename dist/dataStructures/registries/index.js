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
    let components = "";
    const len = keys.length;
    for (let i = 0; i < len; i++) {
        const field = keys[i];
        components += `\n\t\t${field}: ${i},`;
    }
    return Function(`return Object.freeze({${components}})`)();
}
exports.componentRegistryMacro = componentRegistryMacro;
function debugComponent(component, componentClasses) {
    const componentClass = componentClasses[component];
    const { def, name, bytesPerElement } = componentClass;
    return {
        definition: def,
        bytesPerElement,
        name,
        id: component
    };
}
exports.debugComponent = debugComponent;
