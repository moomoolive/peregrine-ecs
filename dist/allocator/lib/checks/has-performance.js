"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasPerformance = void 0;
const is_function_js_1 = require("./is-function.js");
const hasPerformance = () => typeof performance !== "undefined" && (0, is_function_js_1.isFunction)(performance.now);
exports.hasPerformance = hasPerformance;
