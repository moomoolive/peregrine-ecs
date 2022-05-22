export declare const enum error_msgs {
    ecs_signature = "[\uD83E\uDD85 peregrine]",
    assertion = " ASSERTION_FAILED ",
    incorrect_schema = " INCORRECT_SCHEMA "
}
export declare function err(msg: string): string;
export declare function incorrectSchema(msg: string): SyntaxError;
export declare function assertion(msg: string): TypeError;
//# sourceMappingURL=errors.d.ts.map