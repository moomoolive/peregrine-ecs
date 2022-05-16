"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenizeComponentDef = exports.MAX_FIELDS_PER_COMPONENT = exports.DATA_TYPES = void 0;
const errors_1 = require("../debugging/errors");
exports.DATA_TYPES = ["num", "f64", "f32", "i32"];
exports.MAX_FIELDS_PER_COMPONENT = 9;
/* returns if string follows the ecmascript identifier
naming rules (excluding keywords and unicode).

Allows for alpha-numeric characters, $, and _.
Numbers are not allow to be the first character.

taken from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#variables */
const ALLOWED_CHARACTERS_IN_VARIABLE_NAME = /^[A-Za-z_\\$][A-Za-z0-9_\\$]*$/;
function validVariableName(candidate) {
    return (ALLOWED_CHARACTERS_IN_VARIABLE_NAME.test(candidate)
        && candidate.length > 0);
}
function validFieldName(name) {
    return (validVariableName(name)
        && !name.startsWith("set_" /* field_setter_prefix */));
}
function tokenizeComponentDef(name, definition) {
    if (typeof name !== "string" || name.length < 1) {
        throw SyntaxError((0, errors_1.err)(`components must be named with a non empty-string. Component with definition ${JSON.stringify(definition)} has no name.`));
    }
    if (name.startsWith("@@" /* internal_field_prefix */)) {
        throw SyntaxError((0, errors_1.err)(`component name "${name}" cannot start with "${"@@" /* internal_field_prefix */}", as these are for ecs reserved fields.`));
    }
    const type = typeof definition;
    if (type !== "object" || definition === null || Array.isArray(definition)) {
        throw SyntaxError((0, errors_1.err)(`component definition "${name}" must be an object with a valid data type (${exports.DATA_TYPES.join(", ")}). Got type "${type}", definition=${definition}.`));
    }
    const fields = Object.keys(definition);
    if (fields.length < 1 || fields.length > exports.MAX_FIELDS_PER_COMPONENT) {
        throw SyntaxError((0, errors_1.err)(`component definition "${name}" must have between 1 - ${exports.MAX_FIELDS_PER_COMPONENT} fields. Got ${fields.length} fields.`));
    }
    const tokens = {
        componentName: name,
        memoryConstructor: Float64Array,
        memoryType: "i32",
        fields: [],
        bytesPerElement: 0,
        bytesPerField: 8,
        componentSegments: fields.length,
        stringifiedDefinition: ""
    };
    const firstField = fields[0];
    if (!validFieldName(firstField)) {
        throw SyntaxError((0, errors_1.err)(`field "${firstField}" of "${name}" must conform to naming standard of js variables (excluding unicode) and cannot start with "${"set_" /* field_setter_prefix */}"`));
    }
    const firstDatatype = definition[firstField];
    if (typeof firstDatatype !== "string") {
        throw TypeError((0, errors_1.err)(`field "${firstField}" of "${name}" is an invalid type ${firstDatatype}. Accepted data types are ${exports.DATA_TYPES.join(", ")}.`));
    }
    switch (firstDatatype) {
        case "num":
        case "f64":
            tokens.fields.push({
                name: firstField,
                databufferOffset: 0
            });
            tokens.bytesPerField = 8;
            tokens.memoryConstructor = Float64Array;
            tokens.memoryType = "f64";
            break;
        case "f32":
            tokens.fields.push({
                name: firstField,
                databufferOffset: 0
            });
            tokens.memoryConstructor = Float32Array;
            tokens.bytesPerField = 4;
            tokens.memoryType = "f32";
            break;
        case "i32":
            tokens.fields.push({
                name: firstField,
                databufferOffset: 0
            });
            tokens.memoryConstructor = Int32Array;
            tokens.bytesPerField = 4;
            tokens.memoryType = "i32";
            break;
        default:
            throw TypeError((0, errors_1.err)(`field "${firstField}" of ${name} is an invalid type "${firstDatatype}". Accepted data types are ${exports.DATA_TYPES.join(", ")}.`));
    }
    tokens.bytesPerElement += tokens.bytesPerField;
    for (let i = 1; i < fields.length; i++) {
        const targetField = fields[i];
        if (!validFieldName(targetField)) {
            throw SyntaxError((0, errors_1.err)(`field "${targetField}" of "${name}" must conform to naming standard of js variables and cannot start with "${"set_" /* field_setter_prefix */}"`));
        }
        const datatype = definition[targetField];
        if (datatype !== firstDatatype) {
            throw TypeError((0, errors_1.err)(`field "${targetField}" of component "${name}" is  not the same type as field "${firstField}" ("${targetField}": ${datatype}, "${firstField}": ${firstDatatype}). All component fields must all have the same type.`));
        }
        tokens.fields.push({
            name: targetField,
            databufferOffset: i
        });
        tokens.bytesPerElement += tokens.bytesPerField;
    }
    tokens.stringifiedDefinition = JSON.stringify(definition);
    return tokens;
}
exports.tokenizeComponentDef = tokenizeComponentDef;
