"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenizeComponentDef = exports.DATA_TYPES_LISTED = exports.DATA_TYPES = void 0;
const errors_1 = require("../debugging/errors");
function validType(type) {
    switch (type) {
        case "num":
        case "f64":
        case "f32":
        case "u32":
        case "i32":
        case "i16":
        case "u16":
        case "u8":
        case "i8":
            return true;
        default:
            return false;
    }
}
exports.DATA_TYPES = [
    "num",
    "f64",
    "f32",
    "u32",
    "i32",
    "i16",
    "u16",
    "u8",
    "i8"
];
exports.DATA_TYPES_LISTED = exports.DATA_TYPES.join(", ");
// Allows for alpha-numeric characters, $, and _.
// Numbers are not allow to be the first character.
const ALLOW_CHARACTERS_IN_VARIABLE_NAME = /^[A-Za-z_\\$][A-Za-z0-9_\\$]*$/;
function validVariableName(candidate) {
    return ALLOW_CHARACTERS_IN_VARIABLE_NAME.test(candidate);
}
function tokenizeComponentDef(name, def) {
    if (typeof name !== "string" || name.length < 1) {
        throw SyntaxError((0, errors_1.err)(`components must be named with a non empty-string, component with definition ${def} has no name.`));
    }
    if (!validVariableName(name)) {
        throw SyntaxError((0, errors_1.err)(`component name "${name}" must conform to naming standard of js variables (excluding unicode)`));
    }
    const type = typeof def;
    if (type !== "object" || def === null || Array.isArray(def)) {
        throw SyntaxError((0, errors_1.err)(`component definition "${name}" must be an object with a valid data type (${exports.DATA_TYPES_LISTED}). Got type "${type}", def=${def}.`));
    }
    const keys = Object.keys(def);
    if (keys.length < 1) {
        throw SyntaxError((0, errors_1.err)(`component definition "${name}" must have at least one field.`));
    }
    const tokens = {
        componentName: name,
        allFields: [],
        fieldToConstructor: [],
        i8: [],
        u8: [],
        u16: [],
        i16: [],
        u32: [],
        i32: [],
        f32: [],
        f64: [],
        elementSize: 0
    };
    for (let i = 0; i < keys.length; i++) {
        const targetKey = keys[i];
        if (!validVariableName(targetKey)) {
            throw SyntaxError((0, errors_1.err)(`field "${targetKey}" of "${name}" must conform to naming standard of js variables (excluding unicode)`));
        }
        const datatype = def[targetKey];
        if (typeof datatype !== "string" || !validType(datatype)) {
            throw TypeError((0, errors_1.err)(`field "${targetKey}" of "${name}" is an invalid type ${datatype}. Accepted data types are ${exports.DATA_TYPES_LISTED}.`));
        }
        switch (datatype) {
            case "num":
            case "f64":
                tokens.f64.push(targetKey);
                tokens.fieldToConstructor.push({
                    name: targetKey,
                    construct: Float64Array.name
                });
                tokens.elementSize += 8;
                break;
            case "f32":
                tokens.f32.push(targetKey);
                tokens.fieldToConstructor.push({
                    name: targetKey,
                    construct: Float32Array.name
                });
                tokens.elementSize += 4;
                break;
            case "u32":
                tokens.u32.push(targetKey);
                tokens.fieldToConstructor.push({
                    name: targetKey,
                    construct: Uint32Array.name
                });
                tokens.elementSize += 4;
                break;
            case "i32":
                tokens.i32.push(targetKey);
                tokens.fieldToConstructor.push({
                    name: targetKey,
                    construct: Int32Array.name
                });
                tokens.elementSize += 4;
                break;
            case "i16":
                tokens.i16.push(targetKey);
                tokens.fieldToConstructor.push({
                    name: targetKey,
                    construct: Int16Array.name
                });
                tokens.elementSize += 2;
                break;
            case "u16":
                tokens.u16.push(targetKey);
                tokens.fieldToConstructor.push({
                    name: targetKey,
                    construct: Uint16Array.name
                });
                tokens.elementSize += 2;
                break;
            case "u8":
                tokens.u8.push(targetKey);
                tokens.fieldToConstructor.push({
                    name: targetKey,
                    construct: Uint8Array.name
                });
                tokens.elementSize += 1;
                break;
            case "i8":
                tokens.i8.push(targetKey);
                tokens.fieldToConstructor.push({
                    name: targetKey,
                    construct: Int8Array.name
                });
                tokens.elementSize += 1;
                break;
            default:
                throw TypeError((0, errors_1.err)(`field "${targetKey}" of "${name}" is an invalid type ${datatype}. Accepted data types are ${exports.DATA_TYPES_LISTED}.`));
        }
        tokens.allFields.push(targetKey);
    }
    return tokens;
}
exports.tokenizeComponentDef = tokenizeComponentDef;
