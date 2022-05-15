import {
    reservedJsKeyword, 
    validVariableName
} from "./nameValidation"
import {err} from "../debugging/errors"

export const DATA_TYPES = ["num", "f64", "f32", "i32"] as const

export type Types = typeof DATA_TYPES[number]

export type ComponentTypedArray = (
    | Int32Array
    | Float32Array
    | Float64Array
)

export type ComponentTypedArrayConstructor = (
    Float64ArrayConstructor
    | Float32ArrayConstructor
    | Int32ArrayConstructor
)

export type ComponentTokens = {
    componentName: string,
    memoryConstructor: ComponentTypedArrayConstructor,
    memoryType: Types,
    fields: {name: string, databufferOffset: number}[]
    bytesPerElement: number
    bytesPerField: (4 | 8),
    componentSegments: number,
    stringifiedDefinition: string
}

export const MAX_FIELDS_PER_COMPONENT = 9

export function tokenizeComponentDef(
    name: any, 
    definition: any
): ComponentTokens {
    if (typeof name !== "string" || name.length < 1) {
        throw SyntaxError(err(`components must be named with a non empty-string. Component with definition ${JSON.stringify(definition)} has no name.`))
    }
    if (!validVariableName(name)|| reservedJsKeyword(name)) {
        throw SyntaxError(err(`component name "${name}" must conform to naming standard of js variables (excluding unicode).`))
    }
    const type = typeof definition
    if (type !== "object" || definition === null || Array.isArray(definition)) {
        throw SyntaxError(err(`component definition "${name}" must be an object with a valid data type (${DATA_TYPES.join(", ")}). Got type "${type}", definition=${definition}.`))
    }
    const fields = Object.keys(definition)
    if (fields.length < 1 || fields.length > MAX_FIELDS_PER_COMPONENT) {
        throw SyntaxError(err(`component definition "${name}" must have between 1 - ${MAX_FIELDS_PER_COMPONENT} fields. Got ${fields.length} fields.`))
    }
    const tokens: ComponentTokens = {
        componentName: name,
        memoryConstructor: Float64Array,
        memoryType: "i32",
        fields: [],
        bytesPerElement: 0,
        bytesPerField: 8,
        componentSegments: fields.length,
        stringifiedDefinition: ""
    }
    
    const firstField = fields[0]
    if (!validVariableName(firstField)) {
        throw SyntaxError(err(`field "${firstField}" of "${name}" must conform to naming standard of js variables (excluding unicode)`))
    }
    const firstDatatype = definition[firstField]
    if (typeof firstDatatype !== "string") {
        throw TypeError(err(`field "${firstField}" of "${name}" is an invalid type ${firstDatatype}. Accepted data types are ${DATA_TYPES.join(", ")}.`))
    }
    
    switch(firstDatatype) {
        case "num":
        case "f64":
            tokens.fields.push({
                name: firstField,
                databufferOffset: 0
            })
            tokens.bytesPerField = 8
            tokens.memoryConstructor = Float64Array
            tokens.memoryType = "f64"
            break
        case "f32":
            tokens.fields.push({
                name: firstField,
                databufferOffset: 0
            })
            tokens.memoryConstructor = Float32Array
            tokens.bytesPerField = 4
            tokens.memoryType = "f32"
            break
        case "i32":
            tokens.fields.push({
                name: firstField,
                databufferOffset: 0
            })
            tokens.memoryConstructor = Int32Array
            tokens.bytesPerField = 4
            tokens.memoryType = "i32"
            break
        default:
            throw TypeError(err(`field "${firstField}" of ${name} is an invalid type "${firstDatatype}". Accepted data types are ${DATA_TYPES.join(", ")}.`))
    }
    tokens.bytesPerElement += tokens.bytesPerField

    for (let i = 1; i < fields.length; i++) {
        const targetField = fields[i]
        if (!validVariableName(targetField)) {
            throw SyntaxError(err(`field "${targetField}" of "${name}" must conform to naming standard of js variables (excluding unicode)`))
        }
        const datatype = definition[targetField]
        if (datatype !== firstDatatype) {
            throw TypeError(err(`field "${targetField}" of component "${name}" is  not the same type as field "${firstField}" ("${targetField}": ${datatype}, "${firstField}": ${firstDatatype}). All component fields must all have the same type.`))
        }
        tokens.fields.push({
            name: targetField, 
            databufferOffset: i
        })
        tokens.bytesPerElement += tokens.bytesPerField
    }
    tokens.stringifiedDefinition = JSON.stringify(definition)
    return tokens
}