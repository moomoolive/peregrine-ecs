"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sealed = void 0;
/**
 * Class decorator. Seals both constructor and prototype.
 *
 * @param constructor - class ctor to seal
 */
const sealed = (constructor) => {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
};
exports.sealed = sealed;
