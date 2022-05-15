"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservedJsKeyword = exports.validVariableName = void 0;
// Allows for alpha-numeric characters, $, and _.
// Numbers are not allow to be the first character.
const ALLOW_CHARACTERS_IN_VARIABLE_NAME = /^[A-Za-z_\\$][A-Za-z0-9_\\$]*$/;
function validVariableName(candidate) {
    return ALLOW_CHARACTERS_IN_VARIABLE_NAME.test(candidate);
}
exports.validVariableName = validVariableName;
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
exports.reservedJsKeyword = reservedJsKeyword;
