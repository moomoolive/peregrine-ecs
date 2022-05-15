"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUint32 = void 0;
const isUint32 = (x) => typeof x === "number" && x >>> 0 === x;
exports.isUint32 = isUint32;
