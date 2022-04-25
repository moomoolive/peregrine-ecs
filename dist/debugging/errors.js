"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.err = exports.ERROR_SIGNATURE = void 0;
exports.ERROR_SIGNATURE = "[🦅 peregrine]";
function err(msg) {
    return exports.ERROR_SIGNATURE + msg;
}
exports.err = err;
