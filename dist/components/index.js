"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateComponentClasses = exports.componentMacro = void 0;
const tokenizeDef_1 = require("./tokenizeDef");
const errors_1 = require("../debugging/errors");
const GARBAGE_COLLECTION_LIMIT = 15;
function componentMacro(name, def) {
    const { componentName, fieldToConstructor, allFields, elementSize } = (0, tokenizeDef_1.tokenizeComponentDef)(name, def);
    const generatedClass = Function(`return {
        name: ${componentName},
        bytesPerElement: ${elementSize},

        new: (initialCapacity) => {
            ${fieldToConstructor.map(({ name, construct }) => {
        return `this.${name} = new ${construct}(initialCapacity)`;
    }).join("\n\t\t")}
        },
        def: () => (${JSON.stringify(def)}),
        push: (component, obj, length) => {
            const mutIndex = length
            const len = length + 1
            if (len > component.${allFields[0]}.length) {
                const capacity = length * 2
                ${fieldToConstructor.map(({ name, construct }) => {
        return `const new_${name} = new ${construct}(new SharedArrayBuffer(capacity * ${construct}.BYTES_PER_ELEMENT)); new_${name}.set(component.${name}, 0); component.${name} = new_${name}`;
    }).join("\n\t\t    ")}
            }
            ${allFields.map((field) => {
        return `component.${field}[mutIndex] = obj.${field}`;
    }).join("\n\t\t")}
            return len
        },
        pop: (component, length) => {
            if (length < 1) {
                return length
            }
            if ((component.${allFields[0]}.length - length) > ${GARBAGE_COLLECTION_LIMIT}) {
                const capacity = length + ${GARBAGE_COLLECTION_LIMIT}
                ${fieldToConstructor.map(({ name, construct }) => {
        return `const new_${name} = new ${construct}(new SharedArrayBuffer(capacity * ${construct}.BYTES_PER_ELEMENT)); for (let i = 0; i < length; i++) { new_${name}[i] = component.${name}[i] }; component.${name} = new_${name}`;
    }).join("\n\t\t    ")}
            }
            return length - 1
        },
        consume: (consumer, consumed, index) => {

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
