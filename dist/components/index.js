"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateComponentStructProxies = exports.structProxyMacro = exports.StructProxyClass = exports.RawComponent = exports.MAX_FIELDS_PER_COMPONENT = void 0;
const tokenizeDef_1 = require("./tokenizeDef");
const errors_1 = require("../debugging/errors");
var tokenizeDef_2 = require("./tokenizeDef");
Object.defineProperty(exports, "MAX_FIELDS_PER_COMPONENT", { enumerable: true, get: function () { return tokenizeDef_2.MAX_FIELDS_PER_COMPONENT; } });
function createComponentViewClass({ fields }) {
    const BaseView = function (component, offset) {
        this["@@component" /* databuffer_ref */] = component;
        this["@@offset" /* buffer_offset */] = offset;
    };
    const viewPrototype = {};
    /* create setter & getter methods that map field names
    to offset in typed array */
    for (let i = 0; i < fields.length; i++) {
        const { name: fieldName, databufferOffset } = fields[i];
        Object.defineProperty(viewPrototype, fieldName, {
            get() {
                return this["@@component"].databuffer[this["@@offset"] + databufferOffset];
            },
            set(value) {
                this["@@component"].databuffer[this["@@offset"] + databufferOffset] = value;
            }
        });
    }
    BaseView.prototype = viewPrototype;
    return BaseView;
}
class RawComponent {
    constructor({ View, bytesPerElement, componentSegements, bytesPerField, memoryConstructor, id }, databuffer) {
        this.memoryConstructor = memoryConstructor;
        this.bytesPerElement = bytesPerElement;
        this.componentSegements = componentSegements;
        this.databuffer = databuffer;
        this.structProxyFactory = View;
        this.bytesPerField = bytesPerField;
        this.id = id;
    }
    index(index) {
        return new this.structProxyFactory(this, index * this.componentSegements);
    }
}
exports.RawComponent = RawComponent;
class StructProxyClass {
    constructor(id, tokens, View) {
        const { bytesPerElement, stringifiedDefinition, componentName, componentSegments, bytesPerField, memoryConstructor } = tokens;
        this.View = View;
        this.memoryConstructor = memoryConstructor;
        this.bytesPerElement = bytesPerElement;
        this.componentSegements = componentSegments;
        this.bytesPerField = bytesPerField;
        this.stringifiedDefinition = stringifiedDefinition;
        this.tokens = tokens;
        this.name = componentName;
        this.id = id;
    }
}
exports.StructProxyClass = StructProxyClass;
function structProxyMacro(id, name, definition) {
    const tokens = (0, tokenizeDef_1.tokenizeComponentDef)(name, definition);
    const ViewClass = createComponentViewClass(tokens);
    const componentViewClass = new StructProxyClass(id, tokens, ViewClass);
    return componentViewClass;
}
exports.structProxyMacro = structProxyMacro;
function generateComponentStructProxies(declaration) {
    const components = [];
    const componentNames = Object.keys(declaration);
    if (componentNames.length < 1) {
        throw SyntaxError((0, errors_1.err)(`you must declare at least one component`));
    }
    for (let i = 0; i < componentNames.length; i++) {
        const name = componentNames[i];
        const definition = declaration[name];
        const id = i;
        const componentView = structProxyMacro(id, name, definition);
        components.push(componentView);
    }
    return components;
}
exports.generateComponentStructProxies = generateComponentStructProxies;
