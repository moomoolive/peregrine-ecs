"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_DISABLE = exports.EVENT_ENABLE = exports.EVENT_ALL = exports.NO_OP = exports.SEMAPHORE = exports.DEFAULT_EPS = void 0;
exports.DEFAULT_EPS = 1e-6;
/**
 * Internal use only. **Do NOT use in user land code!**
 *
 * @internal
 */
exports.SEMAPHORE = Symbol();
/**
 * No-effect placeholder function.
 */
const NO_OP = () => { };
exports.NO_OP = NO_OP;
/**
 * Catch-all event ID
 */
exports.EVENT_ALL = "*";
exports.EVENT_ENABLE = "enable";
exports.EVENT_DISABLE = "disable";
