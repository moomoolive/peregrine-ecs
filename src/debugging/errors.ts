export const enum error_msgs {
    ecs_signature = "[🦅 peregrine]",
    assertion = " ASSERTION_FAILED " 
}

export function err(msg: string): string {
    return error_msgs.ecs_signature + msg
}

export function assertion(msg: string): TypeError {
    return TypeError(err(error_msgs.assertion + msg))
}
