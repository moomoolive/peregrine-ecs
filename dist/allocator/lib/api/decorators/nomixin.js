"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nomixin = void 0;
/**
 * Method property decorator. Sets `configurable` flag of
 * PropertyDescriptor to `false` (same as `@configurable(false)`).
 * Intended to be used in combination with mixin decorators to enable
 * partial implementations of mixed-in behaviors in target class and
 * avoid them being overidden by mixed-in behaviour.
 */
const nomixin = (_, __, descriptor) => {
    descriptor.configurable = false;
};
exports.nomixin = nomixin;
