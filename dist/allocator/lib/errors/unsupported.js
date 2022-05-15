"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsupported = exports.UnsupportedOperationError = void 0;
const deferror_js_1 = require("./deferror.js");
exports.UnsupportedOperationError = (0, deferror_js_1.defError)(() => "unsupported operation");
const unsupported = (msg) => {
    throw new exports.UnsupportedOperationError(msg);
};
exports.unsupported = unsupported;
