import {EntityRecords} from "./entities/index"
import {Veci32} from "./dataStructures/veci32/index"

export class Ecs {
    protected _memory: {
        unusedIds: Veci32
        entityRecords: EntityRecords
    }

    constructor() {
        this._memory = {
            unusedIds: new Veci32(1),
            entityRecords: new EntityRecords(1)
        }
    }
}
