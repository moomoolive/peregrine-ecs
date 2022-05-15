"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIntString = void 0;
const RE = /^(?:[-+]?(?:0|[1-9][0-9]*))$/;
const isIntString = (x) => RE.test(x);
exports.isIntString = isIntString;
