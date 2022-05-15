"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIterable = void 0;
const isIterable = (x) => x != null && typeof x[Symbol.iterator] === "function";
exports.isIterable = isIterable;
