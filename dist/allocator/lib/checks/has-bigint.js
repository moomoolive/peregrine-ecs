"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasBigInt = void 0;
const hasBigInt = () => typeof BigInt === "function";
exports.hasBigInt = hasBigInt;
