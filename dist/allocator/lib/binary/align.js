"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAligned = exports.align = void 0;
/**
 * Aligns `addr` to next multiple of `size`. The latter must be a power
 * of 2.
 *
 * @param addr - value to align
 * @param size - alignment value
 */
const align = (addr, size) => (size--, (addr + size) & ~size);
exports.align = align;
/**
 * Returns true if `addr` is aligned to wordsize `size`.
 */
const isAligned = (addr, size) => !(addr & (size - 1));
exports.isAligned = isAligned;
