"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defError = void 0;
const defError = (prefix, suffix = (msg) => (msg !== undefined ? ": " + msg : "")) => class extends Error {
    constructor(msg) {
        super(prefix(msg) + suffix(msg));
    }
};
exports.defError = defError;
