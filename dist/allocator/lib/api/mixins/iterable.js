"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iterable = void 0;
const mixin_js_1 = require("../mixin.js");
const iterable = (prop) => (0, mixin_js_1.mixin)({
    *[Symbol.iterator]() {
        yield* this[prop];
    },
});
exports.iterable = iterable;
