"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUUIDv4 = void 0;
const RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const isUUIDv4 = (x) => RE.test(x);
exports.isUUIDv4 = isUUIDv4;
