"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurable = void 0;
/**
 * Property decorator factory. Sets `configurable` flag of PropertyDescriptor
 * to given state.
 *
 * @param state - true, if propoerty is configurable
 */
const configurable = (state) => function (_, __, descriptor) {
    descriptor.configurable = state;
};
exports.configurable = configurable;
