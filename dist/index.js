"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ecs = void 0;
const dataStructures_1 = require("./dataStructures");
const archetypes_1 = require("./archetypes");
const entities_1 = require("./entities");
class Ecs {
    constructor() {
        this.unusedIds = new dataStructures_1.EntityIds();
        this.archetypes = [(0, archetypes_1.ID)(), (0, archetypes_1.COMPONENT)()];
        const index = new Map();
        index.set(0 /* id */, (0, entities_1.EntityRecord)(this.archetypes[0], 0, -1 /* none */));
        index.set(0 /* component */, (0, entities_1.EntityRecord)(this.archetypes[1], 1, -1 /* none */));
        this.entityIndex = index;
        this.componentClasses = [];
        this.systems = [];
    }
}
exports.Ecs = Ecs;
