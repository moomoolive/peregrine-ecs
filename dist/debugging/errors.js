"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assert = exports.assertion = exports.err = void 0;
function err(msg) {
    return "[\uD83E\uDD85 peregrine]" /* ecs_signature */ + msg;
}
exports.err = err;
function assertion(msg) {
    return err(" ASSERTION_FAILED " /* assertion */ + msg);
}
exports.assertion = assertion;
function assert(failed, onFailMsg) {
    if (failed) {
        throw TypeError(assertion(onFailMsg));
    }
}
exports.assert = assert;
