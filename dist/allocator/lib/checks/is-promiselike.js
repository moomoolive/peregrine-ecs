"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPromiseLike = void 0;
const implements_function_js_1 = require("./implements-function.js");
const isPromiseLike = (x) => x instanceof Promise ||
    ((0, implements_function_js_1.implementsFunction)(x, "then") && (0, implements_function_js_1.implementsFunction)(x, "catch"));
exports.isPromiseLike = isPromiseLike;
