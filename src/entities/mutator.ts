import type {BaseEcs} from "../ecs/index"
import {
    ComponentsDeclaration
} from "../components/index"

export class EntityMutator {
    private "@self": BaseEcs<ComponentsDeclaration>
    
    constructor(self: BaseEcs<ComponentsDeclaration>) {
        this["@self"] = self
    }

    remove(componentId: number): EntityMutator {
        return this
    }

    update(): 0 | 1 {
        return 0
    }
}