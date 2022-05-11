"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comps = {
    position: 1,
    velocity: 2
};
function fn(...q) {
    return {};
}
// works
const q = fn(comps.position, comps.velocity)[1];
