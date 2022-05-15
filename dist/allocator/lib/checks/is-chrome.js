"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isChrome = void 0;
const isChrome = () => typeof window !== "undefined" && !!window["chrome"];
exports.isChrome = isChrome;
