import {
    EntityRecord
} from "./entities/index"
import {
    Veci32
} from "./dataStructures/veci32/index"
import {
    Table
} from "./table/index"

export class Ecs {
    /** entity ids that were recycled or not used yet */
    protected _unusedEntityIds: Veci32
    /** which archetype and row an entity resides in */
    protected _entityRecords: EntityRecord[]
    /** a table holds entities that have the exact same components */
    protected _tables: Table[]

    constructor() {
        this._unusedEntityIds = new Veci32(1)
        this._entityRecords = []
        this._tables = []
    }
}
