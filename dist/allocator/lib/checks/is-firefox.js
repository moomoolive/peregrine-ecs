"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFirefox = void 0;
const isFirefox = () => typeof window !== "undefined" && !!window["InstallTrigger"];
exports.isFirefox = isFirefox;
