"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateComponentStructProxies = exports.orderComponentsByName = exports.orderKeysByName = exports.deserializeComponentId = exports.computeComponentId = exports.structProxyMacro = exports.StructProxyClass = exports.RawComponent = void 0;
const tokenizeDef_1 = require("./tokenizeDef");
const errors_1 = require("../debugging/errors");
function createComponentViewClass({ fields, componentName }) {
    const BaseStructProxy = function (component, offset) {
        this["@@component" /* databuffer_ref */] = component;
        this["@@offset" /* buffer_offset */] = offset;
    };
    /* set function name for proxy class,
    so that the console displays
    a name that makes sense for each proxy */
    Object.defineProperty(BaseStructProxy, "name", {
        value: `${componentName}StructProxy`
    });
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
    BaseStructProxy.prototype = viewPrototype;
    return BaseStructProxy;
}
class RawComponent {
    constructor(id, bytesPerElement, componentSegments, memoryConstructor, View, databuffer) {
        this.memoryConstructor = memoryConstructor;
        this.bytesPerElement = bytesPerElement;
        this.componentSegements = componentSegments;
        this.databuffer = databuffer;
        this.structProxyFactory = View;
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
function orderKeysByName(keys) {
    /* components are order alphabetically */
    return keys.sort();
}
exports.orderKeysByName = orderKeysByName;
function orderComponentsByName(declaration) {
    return orderKeysByName(Object.keys(declaration));
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
