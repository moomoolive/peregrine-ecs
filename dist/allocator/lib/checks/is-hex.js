"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHex = void 0;
const isHex = (x) => /^[a-f0-9]+$/i.test(x);
exports.isHex = isHex;
