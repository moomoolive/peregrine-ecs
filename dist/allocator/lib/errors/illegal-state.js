"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.illegalState = exports.IllegalStateError = void 0;
const deferror_js_1 = require("./deferror.js");
exports.IllegalStateError = (0, deferror_js_1.defError)(() => "illegal state");
const illegalState = (msg) => {
    throw new exports.IllegalStateError(msg);
};
exports.illegalState = illegalState;
