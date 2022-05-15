"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasCrypto = void 0;
const hasCrypto = () => typeof window !== "undefined" && window["crypto"] !== undefined;
exports.hasCrypto = hasCrypto;
