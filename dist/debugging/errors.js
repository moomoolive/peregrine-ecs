"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertion = exports.err = void 0;
function err(msg) {
    return "[\uD83E\uDD85 peregrine]" /* ecs_signature */ + msg;
}
exports.err = err;
function assertion(msg) {
    return err(" ASSERTION_FAILED " /* assertion */ + msg);
}
exports.assertion = assertion;
