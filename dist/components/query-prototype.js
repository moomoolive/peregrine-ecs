"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const components = {
    position: {
        id: 1,
        def: { x: "i32" }
    },
    velocity: {
        id: 2,
        def: { x: "f32", y: "f32", z: "f32" }
    }
};
const comps = {
    position: 1,
    velocity: 2
};
function fn(q) {
    return {};
}
const { position, velocity } = components;
// works
const q = fn([comps.position, comps.velocity])[0];
