import {Table} from "../table/index"

export class EntityRecord {
    table: Table | null
    row: number
    
    constructor(arch: Table | null, row: number) {
        this.table = arch
        this.row = row
    }
}
