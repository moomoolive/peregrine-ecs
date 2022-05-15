"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUUID = void 0;
const RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUUID = (x) => RE.test(x);
exports.isUUID = isUUID;
