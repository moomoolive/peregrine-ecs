"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIE = void 0;
const isIE = () => typeof document !== "undefined" &&
    (typeof document["documentMode"] !== "undefined" ||
        navigator.userAgent.indexOf("MSIE") > 0);
exports.isIE = isIE;
