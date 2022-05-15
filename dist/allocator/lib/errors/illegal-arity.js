"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.illegalArity = exports.IllegalArityError = void 0;
const deferror_js_1 = require("./deferror.js");
exports.IllegalArityError = (0, deferror_js_1.defError)(() => "illegal arity");
const illegalArity = (n) => {
    throw new exports.IllegalArityError(n);
};
exports.illegalArity = illegalArity;
