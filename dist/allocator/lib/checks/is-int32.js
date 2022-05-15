"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInt32 = void 0;
const isInt32 = (x) => typeof x === "number" && (x | 0) === x;
exports.isInt32 = isInt32;
