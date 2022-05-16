"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateComponentViewClasses = exports.componentViewMacro = exports.ComponentViewClass = exports.RawComponent = exports.MAX_FIELDS_PER_COMPONENT = void 0;
const tokenizeDef_1 = require("./tokenizeDef");
const errors_1 = require("../debugging/errors");
var tokenizeDef_2 = require("./tokenizeDef");
Object.defineProperty(exports, "MAX_FIELDS_PER_COMPONENT", { enumerable: true, get: function () { return tokenizeDef_2.MAX_FIELDS_PER_COMPONENT; } });
function createComponentViewClass({ fields, componentSegments }) {
    const BaseView = function (self) {
        this["@@self" /* databuffer_ref */] = self;
    };
    const viewPrototype = {};
    const indexesPerElement = componentSegments;
    const { name: firstField } = fields[0];
    /* ideally these setters & getters will be compiled
    away by a build tool -> to make code more efficent */
    /* create getter method that maps field name
    to index in typed array */
    Object.defineProperty(viewPrototype, firstField, {
        value(index) {
            return this["@@self" /* databuffer_ref */].databuffer[index * indexesPerElement];
        }
    });
    /* create setter method that maps field name
    to index in typed array */
    const firstSetterName = ("set_" /* field_setter_prefix */
        + firstField);
    Object.defineProperty(viewPrototype, firstSetterName, {
        value(index, value) {
            this["@@self" /* databuffer_ref */].databuffer[index * indexesPerElement] = value;
        }
    });
    /* create rest of members */
    for (let i = 1; i < fields.length; i++) {
        const { name: fieldName, databufferOffset } = fields[i];
        Object.defineProperty(viewPrototype, fieldName, {
            value(index) {
                return this["@@self" /* databuffer_ref */].databuffer[(index * indexesPerElement) + databufferOffset];
            }
        });
        const setterName = ("set_" /* field_setter_prefix */
            + fieldName);
        Object.defineProperty(viewPrototype, setterName, {
            value(index, value) {
                this["@@self" /* databuffer_ref */].databuffer[(index * indexesPerElement) + databufferOffset] = value;
            }
        });
    }
    BaseView.prototype = viewPrototype;
    return BaseView;
}
class RawComponent {
    constructor({ View, bytesPerElement, componentSegements, bytesPerField, memoryConstructor, id }, databuffer) {
        this.memoryConstructor = memoryConstructor;
        this.databuffer = databuffer;
        this.bytesPerElement = bytesPerElement;
        this.componentSegements = componentSegements;
        this.bytesPerField = bytesPerField;
        this.data = new View(this);
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
function componentViewMacro(id, name, definition) {
    const tokens = (0, tokenizeDef_1.tokenizeComponentDef)(name, definition);
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
