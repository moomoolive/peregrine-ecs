"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.implementsFunction = void 0;
const implementsFunction = (x, fn) => x != null && typeof x[fn] === "function";
exports.implementsFunction = implementsFunction;
