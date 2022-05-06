import {Table} from "../table/index"

export const enum encoding {
    no_archetype = -1
}

export class EntityRecord {
    table: Table | null
    row: number
    
    constructor(arch: Table | null, row: number) {
        this.table = arch
        this.row = row
    }
}
