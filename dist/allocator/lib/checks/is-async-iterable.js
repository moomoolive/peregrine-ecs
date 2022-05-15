"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAsyncIterable = void 0;
const isAsyncIterable = (x) => x != null && typeof x[Symbol.asyncIterator] === "function";
exports.isAsyncIterable = isAsyncIterable;
