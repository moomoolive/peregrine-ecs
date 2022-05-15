"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNotStringAndIterable = void 0;
const isNotStringAndIterable = (x) => x != null &&
    typeof x !== "string" &&
    typeof x[Symbol.iterator] === "function";
exports.isNotStringAndIterable = isNotStringAndIterable;
