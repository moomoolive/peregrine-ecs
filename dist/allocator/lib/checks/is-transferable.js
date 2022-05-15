"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTransferable = void 0;
const isTransferable = (x) => x instanceof ArrayBuffer ||
    (typeof SharedArrayBuffer !== "undefined" &&
        x instanceof SharedArrayBuffer) ||
    (typeof MessagePort !== "undefined" && x instanceof MessagePort);
exports.isTransferable = isTransferable;
