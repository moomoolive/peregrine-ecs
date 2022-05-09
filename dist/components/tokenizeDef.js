"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenizeComponentDef = exports.MAX_FIELDS_PER_COMPONENT = exports.DATA_TYPES_LISTED = exports.DATA_TYPES = void 0;
const errors_1 = require("../debugging/errors");
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
function reservedJsKeyword(word) {
    switch (word) {
        case "false":
        case "true":
        case "null":
        case "await":
        case "static":
        case "public":
        case "protected":
        case "private":
        case "package":
        case "let":
        case "interface":
        case "implements":
        case "yield":
        case "with":
        case "while":
        case "void":
        case "var":
        case "typeof":
        case "try":
        case "throw":
        case "this":
        case "switch":
        case "super":
        case "return":
        case "new":
        case "instanceof":
        case "in":
        case "import":
        case "if":
        case "function":
        case "for":
        case "finally":
        case "extends":
        case "export":
        case "else":
        case "do":
        case "delete":
        case "default":
        case "debugger":
        case "continue":
        case "const":
        case "class":
        case "catch":
        case "case":
        case "break":
            return true;
        default:
            return false;
    }
}
exports.MAX_FIELDS_PER_COMPONENT = 15;
function tokenizeComponentDef(name, def) {
    if (typeof name !== "string" || name.length < 1) {
        throw SyntaxError((0, errors_1.err)(`components must be named with a non empty-string. Component with definition ${JSON.stringify(def)} has no name.`));
    }
    if (!validVariableName(name) || reservedJsKeyword(name)) {
        throw SyntaxError((0, errors_1.err)(`component name "${name}" must conform to naming standard of js variables (excluding unicode).`));
    }
    const type = typeof def;
    if (type !== "object" || def === null || Array.isArray(def)) {
        throw SyntaxError((0, errors_1.err)(`component definition "${name}" must be an object with a valid data type (${exports.DATA_TYPES_LISTED}). Got type "${type}", def=${def}.`));
    }
    const keys = Object.keys(def);
    if (keys.length < 1 || keys.length > exports.MAX_FIELDS_PER_COMPONENT) {
        throw SyntaxError((0, errors_1.err)(`component definition "${name}" must have between 1 - ${exports.MAX_FIELDS_PER_COMPONENT} fields. Got ${keys.length} fields.`));
    }
    const tokens = {
        componentName: name,
        fields: [],
        elementSize: 0
    };
    for (let i = 0; i < keys.length; i++) {
        const targetKey = keys[i];
        if (!validVariableName(targetKey)) {
            throw SyntaxError((0, errors_1.err)(`field "${targetKey}" of "${name}" must conform to naming standard of js variables (excluding unicode)`));
        }
        const datatype = def[targetKey];
        if (typeof datatype !== "string") {
            throw TypeError((0, errors_1.err)(`field "${targetKey}" of "${name}" is an invalid type ${datatype}. Accepted data types are ${exports.DATA_TYPES_LISTED}.`));
        }
        switch (datatype) {
            case "num":
            case "f64":
                tokens.fields.push({
                    name: targetKey,
                    type: Float64Array
                });
                tokens.elementSize += 8;
                break;
            case "f32":
                tokens.fields.push({
                    name: targetKey,
                    type: Float32Array
                });
                tokens.elementSize += 4;
                break;
            case "u32":
                tokens.fields.push({
                    name: targetKey,
                    type: Uint32Array
                });
                tokens.elementSize += 4;
                break;
            case "i32":
                tokens.fields.push({
                    name: targetKey,
                    type: Int32Array
                });
                tokens.elementSize += 4;
                break;
            case "i16":
                tokens.fields.push({
                    name: targetKey,
                    type: Int16Array
                });
                tokens.elementSize += 2;
                break;
            case "u16":
                tokens.fields.push({
                    name: targetKey,
                    type: Uint16Array
                });
                tokens.elementSize += 2;
                break;
            case "u8":
                tokens.fields.push({
                    name: targetKey,
                    type: Uint8Array
                });
                tokens.elementSize += 1;
                break;
            case "i8":
                tokens.fields.push({
                    name: targetKey,
                    type: Int8Array
                });
                tokens.elementSize += 1;
                break;
            default:
                throw TypeError((0, errors_1.err)(`field "${targetKey}" of "${name}" is an invalid type ${datatype}. Accepted data types are ${exports.DATA_TYPES_LISTED}.`));
        }
    }
    return tokens;
}
exports.tokenizeComponentDef = tokenizeComponentDef;
