"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNode = void 0;
const isNode = () => typeof process === "object" &&
    typeof process.versions === "object" &&
    typeof process.versions.node !== "undefined";
exports.isNode = isNode;
