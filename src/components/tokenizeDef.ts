import {err} from "../debugging/errors"

export const DATA_TYPES = [
    "num",
    "f64",
    "f32",
    "u32",
    "i32",
    "i16",
    "u16",
    "u8",
    "i8"
] as const
export const DATA_TYPES_LISTED = DATA_TYPES.join(", ")

export type DefTokens = {
    componentName: string,
    fields: {
        name: string, 
        type: (
            Float64ArrayConstructor
            | Float32ArrayConstructor
            | Int32ArrayConstructor
            | Uint32ArrayConstructor
            | Uint16ArrayConstructor
            | Int16ArrayConstructor
            | Uint16ArrayConstructor
            | Int8ArrayConstructor
            | Uint8ArrayConstructor
        )
    }[]
    elementSize: number
}

// Allows for alpha-numeric characters, $, and _.
// Numbers are not allow to be the first character.
const ALLOW_CHARACTERS_IN_VARIABLE_NAME = /^[A-Za-z_\\$][A-Za-z0-9_\\$]*$/
function validVariableName(candidate: string): boolean {
    return ALLOW_CHARACTERS_IN_VARIABLE_NAME.test(candidate)
}

function reservedJsKeyword(word: string): boolean {
    switch(word) {
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
            return true
        default:
            return false
    }
}

export const MAX_FIELDS_PER_COMPONENT = 15

export function tokenizeComponentDef(
    name: any, 
    def: any
): DefTokens {
    if (typeof name !== "string" || name.length < 1) {
        throw SyntaxError(err(`components must be named with a non empty-string. Component with definition ${JSON.stringify(def)} has no name.`))
    }
    if (!validVariableName(name)|| reservedJsKeyword(name)) {
        throw SyntaxError(err(`component name "${name}" must conform to naming standard of js variables (excluding unicode).`))
    }
    const type = typeof def
    if (type !== "object" || def === null || Array.isArray(def)) {
        throw SyntaxError(err(`component definition "${name}" must be an object with a valid data type (${DATA_TYPES_LISTED}). Got type "${type}", def=${def}.`))
    }
    const keys = Object.keys(def)
    if (keys.length < 1 || keys.length > MAX_FIELDS_PER_COMPONENT) {
        throw SyntaxError(err(`component definition "${name}" must have between 1 - ${MAX_FIELDS_PER_COMPONENT} fields. Got ${keys.length} fields.`))
    }
    const tokens: DefTokens = {
        componentName: name,
        fields: [],
        elementSize: 0
    }
    for (let i = 0; i < keys.length; i++) {
        const targetKey = keys[i]
        if (!validVariableName(targetKey)) {
            throw SyntaxError(err(`field "${targetKey}" of "${name}" must conform to naming standard of js variables (excluding unicode)`))
        }
        const datatype = def[targetKey]
        if (typeof datatype !== "string") {
            throw TypeError(err(`field "${targetKey}" of "${name}" is an invalid type ${datatype}. Accepted data types are ${DATA_TYPES_LISTED}.`))
        }

        switch(datatype) {
            case "num":
            case "f64":
                tokens.fields.push({
                    name: targetKey,
                    type: Float64Array
                })
                tokens.elementSize += 8
                break
            case "f32":
                tokens.fields.push({
                    name: targetKey,
                    type: Float32Array
                })
                tokens.elementSize += 4
                break
            case "u32":
                tokens.fields.push({
                    name: targetKey,
                    type: Uint32Array
                })
                tokens.elementSize += 4
                break
            case "i32":
                tokens.fields.push({
                    name: targetKey,
                    type: Int32Array
                })
                tokens.elementSize += 4
                break
            case "i16":
                tokens.fields.push({
                    name: targetKey,
                    type: Int16Array
                })
                tokens.elementSize += 2
                break
            case "u16":
                tokens.fields.push({
                    name: targetKey,
                    type: Uint16Array
                })
                tokens.elementSize += 2
                break
            case "u8":
                tokens.fields.push({
                    name: targetKey,
                    type: Uint8Array
                })
                tokens.elementSize += 1
                break
            case "i8":
                tokens.fields.push({
                    name: targetKey,
                    type: Int8Array
                })
                tokens.elementSize += 1
                break
            default:
                throw TypeError(err(`field "${targetKey}" of "${name}" is an invalid type ${datatype}. Accepted data types are ${DATA_TYPES_LISTED}.`))
        }
    }
    return tokens
}