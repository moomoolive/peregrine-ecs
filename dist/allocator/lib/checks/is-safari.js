"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSafari = void 0;
const is_chrome_js_1 = require("./is-chrome.js");
const isSafari = () => typeof navigator !== "undefined" &&
    /Safari/.test(navigator.userAgent) &&
    !(0, is_chrome_js_1.isChrome)();
exports.isSafari = isSafari;
