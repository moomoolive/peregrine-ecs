"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDataURL = void 0;
const isDataURL = (x) => /^data:.+\/(.+);base64,/.test(x);
exports.isDataURL = isDataURL;
