"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMobile = void 0;
const isMobile = () => typeof navigator !== "undefined" &&
    /mobile|tablet|ip(ad|hone|od)|android|silk|crios/i.test(navigator.userAgent);
exports.isMobile = isMobile;
