"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isArrayLike = void 0;
const isArrayLike = (x) => x != null && typeof x !== "function" && x.length !== undefined;
exports.isArrayLike = isArrayLike;
