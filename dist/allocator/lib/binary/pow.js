"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.floorPow2 = exports.ceilPow2 = exports.isPow2 = void 0;
// http://graphics.stanford.edu/~seander/bithacks.html
const isPow2 = (x) => !!x && !(x & (x - 1));
exports.isPow2 = isPow2;
const ceilPow2 = (x) => {
    x += (x === 0);
    --x;
    x |= x >>> 1;
    x |= x >>> 2;
    x |= x >>> 4;
    x |= x >>> 8;
    x |= x >>> 16;
    return x + 1;
};
exports.ceilPow2 = ceilPow2;
const floorPow2 = (x) => {
    x |= x >>> 1;
    x |= x >>> 2;
    x |= x >>> 4;
    x |= x >>> 8;
    x |= x >>> 16;
    return x - (x >>> 1);
};
exports.floorPow2 = floorPow2;
