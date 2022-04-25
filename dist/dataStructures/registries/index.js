"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentRegistryMacro = exports.MAX_COMPONENTS = void 0;
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
        const def = declartion[field];
        components += `\n\t\t${field}: Object.freeze({id: ${i}, def: () => ${JSON.stringify(def)}}),`;
    }
    const registry = Function(`return Object.freeze({${components}})`)();
    return {};
}
exports.componentRegistryMacro = componentRegistryMacro;
const def = componentRegistryMacro({
    position: {
        x: "i32",
        y: "i32",
        z: "i32"
    },
    color: {
        x: "u8",
        y: "u8",
        z: "u8"
    }
});
