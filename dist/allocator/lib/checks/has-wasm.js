"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasWASM = void 0;
const hasWASM = () => (typeof window !== "undefined" &&
    typeof window["WebAssembly"] !== "undefined") ||
    (typeof global !== "undefined" &&
        typeof global["WebAssembly"] !== "undefined");
exports.hasWASM = hasWASM;
