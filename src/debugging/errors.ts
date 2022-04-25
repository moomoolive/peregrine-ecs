export const ERROR_SIGNATURE = "[🦅 peregrine]"

export function err(msg: string): string {
    return ERROR_SIGNATURE + msg
}