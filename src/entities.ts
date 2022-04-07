import {Archetype} from "./archetype"

export const enum stdEntities {
    component = 0,
    id = 1
}

export type EntityRecord = {
    archetype: Archetype,
    row: number
}

export function EntityRecord(
    archetype: Archetype, 
    row: number
): EntityRecord {
    return {archetype, row}
}

export type EntityIndex = {
    index: EntityRecord[]
    unusedIndexes: number[]
}

export function EntityIndex(
    index: EntityRecord[]
): EntityIndex {
    return {index: [], unusedIndexes: []}
}
