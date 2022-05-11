"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateComponentClasses = exports.componentMacro = exports.getComponentSegmentsPtr = void 0;
const tokenizeDef_1 = require("./tokenizeDef");
const errors_1 = require("../debugging/errors");
function getComponentSegmentsPtr($allocatorPtrs) {
    return $allocatorPtrs[$allocatorPtrs.length - 1];
}
exports.getComponentSegmentsPtr = getComponentSegmentsPtr;
function componentMacro(name, def) {
    const { componentName, fields, elementSize } = (0, tokenizeDef_1.tokenizeComponentDef)(name, def);
    const tokens = Object.keys(def).map((field, offset) => {
        return {
            name: field,
            type: def[field],
            ptrOffset: offset
        };
    });
    tokens.push({
        name: "$component_segments_ptr",
        type: "i32",
        ptrOffset: fields.length
    });
    const segmentsPtrSize = fields.length + 1 /* component_ptr_size */;
    const generatedClass = Function(`
    class ${componentName}_Proxy {
        constructor(databuffers) {
            this["@self"] = databuffers
        }
        ${fields.map(({ name }, ptrOffset) => {
        return `
        get ${name}() { return this["@self"][${ptrOffset}] }
            `;
    }).join("")}
    }

    return class ${componentName} {
        static stringifiedDef = '${JSON.stringify(def)}'
        static bytesPerElement = ${elementSize}
        static tokens = ${JSON.stringify(tokens)}
        static proxyClass = ${componentName}_Proxy

        constructor(initialCapacity, globalAllocator) {
            const $component_segments_ptr = globalAllocator.malloc(${segmentsPtrSize} * ${Int32Array.BYTES_PER_ELEMENT})
            this.$allocatorPtrs = new Int32Array(globalAllocator.buf, $component_segments_ptr, ${segmentsPtrSize})
            this.$allocatorPtrs[${fields.length}] = $component_segments_ptr
            ${fields.map(({ name, type }, ptrOffset) => {
        return `
            const ${name}_ptr = globalAllocator.malloc(initialCapacity * ${type.BYTES_PER_ELEMENT})
            this.$allocatorPtrs[${ptrOffset}] = ${name}_ptr
            const ${name}_data = new ${type.name}(globalAllocator.buf, ${name}_ptr, initialCapacity)
            `;
    }).join("")}
            this.databuffers = [${fields.map(({ name }) => `${name}_data`).join(", ")}]
            this.data = new ${componentName}_Proxy(this.databuffers)
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
