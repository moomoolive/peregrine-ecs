"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProtoPath = exports.isIllegalKey = void 0;
const is_array_js_1 = require("./is-array.js");
const is_string_js_1 = require("./is-string.js");
const ILLEGAL_KEYS = new Set(["__proto__", "prototype", "constructor"]);
/**
 * Returns true, if given `x` is an illegal object key as per
 * {@link ILLEGAL_KEYS}.
 *
 * @see {@link isProtoPath} for more details
 *
 * @param x -
 */
const isIllegalKey = (x) => ILLEGAL_KEYS.has(x);
exports.isIllegalKey = isIllegalKey;
/**
 * Returns true if given `path` contains any {@link ILLEGAL_KEYS}, i.e. could be
 * used to poison the prototype chain of an object.
 *
 * @remarks
 * If given an array, each item is considered a single sub-path property and
 * will be checked as is. If given a string it will be split using "." as
 * delimiter and each item checked as is (same way array paths are handled).
 *
 * Original discussion here, implementation updated to be more encompassing:
 * https://github.com/thi-ng/umbrella/pull/273
 *
 * @param path -
 */
const isProtoPath = (path) => (0, is_array_js_1.isArray)(path)
    ? path.some(exports.isIllegalKey)
    : (0, is_string_js_1.isString)(path)
        ? path.indexOf(".") !== -1
            ? path.split(".").some(exports.isIllegalKey)
            : (0, exports.isIllegalKey)(path)
        : false;
exports.isProtoPath = isProtoPath;
