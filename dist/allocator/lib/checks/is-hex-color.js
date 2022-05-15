"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHexColor = void 0;
const is_string_js_1 = require("./is-string.js");
const RE = /^#([a-f0-9]{3}|[a-f0-9]{4}(?:[a-f0-9]{2}){0,2})$/i;
const isHexColor = (x) => (0, is_string_js_1.isString)(x) && RE.test(x);
exports.isHexColor = isHexColor;
