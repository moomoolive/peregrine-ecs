"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MASKS = exports.MSB_BITS32 = exports.MSB_BITS16 = exports.MSB_BITS8 = void 0;
const defBits = (n) => new Array(n).fill(0).map((_, i) => 1 << (n - 1 - i));
/**
 * 8bit values in MSB order (i.e. MSB_BITS[0] = 0x80)
 */
exports.MSB_BITS8 = defBits(8);
/**
 * 16bit values in MSB order (i.e. MSB_BITS[0] = 0x8000)
 */
exports.MSB_BITS16 = defBits(16);
/**
 * 32bit values in MSB order (i.e. MSB_BITS[0] = 0x80000000)
 */
exports.MSB_BITS32 = defBits(32);
exports.MASKS = new Array(33).fill(0).map((_, i) => Math.pow(2, i) - 1);
