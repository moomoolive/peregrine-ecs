"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMPONENT = exports.ID = exports.Archetype = void 0;
const dataStructures_1 = require("./dataStructures");
function Archetype(typeCapacity, entityCapacity, components) {
    return {
        type: new dataStructures_1.EntityIds(typeCapacity),
        entityIds: new dataStructures_1.EntityIds(entityCapacity),
        components
    };
}
exports.Archetype = Archetype;
function ID() {
    const archetype = Archetype(2, 2, []);
    archetype.type.push({ id: 0 /* id */ }, { id: 0 /* component */ });
    archetype.entityIds.push({ id: 0 /* id */ }, { id: 0 /* component */ });
    return archetype;
}
exports.ID = ID;
function COMPONENT() {
    const archetype = Archetype(2, 2, []);
    archetype.type.push({ id: 0 /* id */ }, { id: 0 /* component */ });
    archetype.entityIds.push({ id: 0 /* id */ }, { id: 0 /* component */ });
    return archetype;
}
exports.COMPONENT = COMPONENT;
