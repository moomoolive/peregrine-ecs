"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.illegalArgs = exports.IllegalArgumentError = void 0;
const deferror_js_1 = require("./deferror.js");
exports.IllegalArgumentError = (0, deferror_js_1.defError)(() => "illegal argument(s)");
const illegalArgs = (msg) => {
    throw new exports.IllegalArgumentError(msg);
};
exports.illegalArgs = illegalArgs;
