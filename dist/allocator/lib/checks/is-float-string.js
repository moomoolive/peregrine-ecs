"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFloatString = void 0;
const RE = /^(?:[-+]?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/;
const isFloatString = (x) => x.length > 0 && RE.test(x);
exports.isFloatString = isFloatString;
