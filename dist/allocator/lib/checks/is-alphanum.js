"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumeric = exports.isAlphaNum = exports.isAlpha = void 0;
const isAlpha = (x) => /^[a-z]+$/i.test(x);
exports.isAlpha = isAlpha;
const isAlphaNum = (x) => /^[a-z0-9]+$/i.test(x);
exports.isAlphaNum = isAlphaNum;
const isNumeric = (x) => /^[0-9]+$/.test(x);
exports.isNumeric = isNumeric;
