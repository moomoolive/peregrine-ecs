"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateComponentClasses = exports.componentMacro = void 0;
const tokenizeDef_1 = require("./tokenizeDef");
const errors_1 = require("../debugging/errors");
function componentMacro(name, def) {
    const { componentName, fields, elementSize } = (0, tokenizeDef_1.tokenizeComponentDef)(name, def);
    const generatedClass = Function(`return class ${componentName} {
        static def = ${JSON.stringify(def)}
        static bytesPerElement = ${elementSize}

        constructor(initialCapacity, allocator) {
            this["&allocatorPtrs"] = new Int32Array(${fields.length})
            ${fields.map(({ name, type }) => {
        return `
                this.${name} = new ${type.name}(initialCapacity)
            `;
    }).join("\n\t\t")}
        }
    }`)();
    return generatedClass;
}
exports.componentMacro = componentMacro;
function generateComponentClasses(declaration) {
    const components = [];
    const keys = Object.keys(declaration);
    if (keys.length < 1) {
        throw SyntaxError((0, errors_1.err)(`you must declare at least one component`));
    }
    const len = keys.length;
    for (let i = 0; i < len; i++) {
        const key = keys[i];
        components.push(componentMacro(key, declaration[key]));
    }
    return components;
}
exports.generateComponentClasses = generateComponentClasses;
