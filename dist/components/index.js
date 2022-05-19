"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateComponentStructProxies = exports.orderComponentsByName = exports.deserializeComponentId = exports.computeComponentId = exports.structProxyMacro = exports.StructProxyClass = exports.RawComponent = void 0;
const tokenizeDef_1 = require("./tokenizeDef");
const errors_1 = require("../debugging/errors");
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
function computeComponentId(offset) {
    return offset + 50 /* components_start */;
}
exports.computeComponentId = computeComponentId;
function deserializeComponentId(id) {
    return id - 50 /* reserved_count */;
}
exports.deserializeComponentId = deserializeComponentId;
function orderComponentsByName(declaration) {
    /* components are order alphabetically */
    return Object.keys(declaration).sort();
}
exports.orderComponentsByName = orderComponentsByName;
function generateComponentStructProxies(declaration) {
    const componentNames = orderComponentsByName(declaration);
    if (componentNames.length < 1) {
        throw SyntaxError((0, errors_1.err)(`you must declare at least one component`));
    }
    const proxyClasses = [];
    for (let i = 0; i < componentNames.length; i++) {
        const name = componentNames[i];
        const definition = declaration[name];
        const id = computeComponentId(i);
        const proxyStructClass = structProxyMacro(id, name, definition);
        proxyClasses.push(proxyStructClass);
    }
    return { proxyClasses, orderedComponentNames: componentNames };
}
exports.generateComponentStructProxies = generateComponentStructProxies;
