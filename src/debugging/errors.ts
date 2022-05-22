export const enum error_msgs {
    ecs_signature = "[🦅 peregrine]",
    assertion = " ASSERTION_FAILED ",
    incorrect_schema = " INCORRECT_SCHEMA " 
}

export function err(msg: string): string {
    return error_msgs.ecs_signature + msg
}

export function incorrectSchema(msg: string): SyntaxError {
    return SyntaxError(err(error_msgs.incorrect_schema + msg))
}

export function assertion(msg: string): TypeError {
    return TypeError(err(error_msgs.assertion + msg))
}
