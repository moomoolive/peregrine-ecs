"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateComponentViewClasses = exports.componentViewMacro = exports.ComponentViewClass = exports.RawComponent = void 0;
const tokenizeDef_1 = require("./tokenizeDef");
const errors_1 = require("../debugging/errors");
function createComponentViewClass(tokens) {
    const BaseView = function (self) {
        this["@self"] = self;
    };
    const viewPrototype = {};
    for (let i = 0; i < tokens.fields.length; i++) {
        const { name, databufferOffset } = tokens.fields[i];
        /* create getter methods that map field names
        to a buffer
        */
        Object.defineProperty(viewPrototype, name, {
            get() { return this["@self"][databufferOffset]; }
        });
    }
    BaseView.prototype = viewPrototype;
    return BaseView;
}
class RawComponent {
    constructor({ View, bytesPerElement, componentSegements, bytesPerField, memoryConstructor, id }, memoryBuffer, componentPtr, initialCapacity) {
        this.databuffers = [];
        this.memoryConstructor = memoryConstructor;
        this.bytesPerElement = bytesPerElement;
        this.componentSegements = componentSegements;
        this.bytesPerField = bytesPerField;
        const databuffers = this.databuffers;
        let ptr = componentPtr;
        const segementSize = bytesPerElement * initialCapacity;
        for (let i = 0; i < componentSegements; i++) {
            const segment = new memoryConstructor(memoryBuffer, ptr, initialCapacity);
            databuffers.push(segment);
            ptr += segementSize;
        }
        this.data = new View(databuffers);
        this.id = id;
    }
}
exports.RawComponent = RawComponent;
class ComponentViewClass {
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
exports.ComponentViewClass = ComponentViewClass;
function componentViewMacro(id, name, def) {
    const tokens = (0, tokenizeDef_1.tokenizeComponentDef)(name, def);
    const ViewClass = createComponentViewClass(tokens);
    const componentViewClass = new ComponentViewClass(id, tokens, ViewClass);
    return componentViewClass;
}
exports.componentViewMacro = componentViewMacro;
function generateComponentViewClasses(declaration) {
    const components = [];
    const componentNames = Object.keys(declaration);
    if (componentNames.length < 1) {
        throw SyntaxError((0, errors_1.err)(`you must declare at least one component`));
    }
    for (let i = 0; i < componentNames.length; i++) {
        const name = componentNames[i];
        const definition = declaration[name];
        const id = i;
        const componentView = componentViewMacro(id, name, definition);
        components.push(componentView);
    }
    return components;
}
exports.generateComponentViewClasses = generateComponentViewClasses;
