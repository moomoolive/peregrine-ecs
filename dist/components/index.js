"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentMacro = void 0;
const tokenizeDef_1 = require("./tokenizeDef");
const GARBAGE_COLLECTION_LIMIT = 15;
function componentMacro(name, def) {
    const { componentName, fieldToConstructor, allFields, elementSize } = (0, tokenizeDef_1.tokenizeComponentDef)(name, def);
    const generatedClass = Function(`return class ${componentName} {
        static def = ${JSON.stringify(def)}
        static bytesPerElement = ${elementSize}
        
        static push(component, obj, length) {
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
        }

        static pop(component, length) {
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
        }

        static consume(consumer, consumed, index) {

        }
        
        constructor(initialCapacity) {
            ${fieldToConstructor.map(({ name, construct }) => {
        return `this.${name} = new ${construct}(initialCapacity)`;
    }).join("\n\t\t")}
        }
    }`)();
    return generatedClass;
}
exports.componentMacro = componentMacro;
