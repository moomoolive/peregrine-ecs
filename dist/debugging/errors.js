"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertion = exports.incorrectSchema = exports.err = void 0;
function err(msg) {
    return "[\uD83E\uDD85 shahin]" /* ecs_signature */ + msg;
}
exports.err = err;
function incorrectSchema(msg) {
    return SyntaxError(err(" INCORRECT_SCHEMA " /* incorrect_schema */ + msg));
}
exports.incorrectSchema = incorrectSchema;
function assertion(msg) {
    return TypeError(err(" ASSERTION_FAILED " /* assertion */ + msg));
}
exports.assertion = assertion;
