"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasWebSocket = void 0;
const hasWebSocket = () => typeof WebSocket !== "undefined";
exports.hasWebSocket = hasWebSocket;
