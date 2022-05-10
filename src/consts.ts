export const enum Bytes {
    i32 = 4,
    u8 = 1,
    f64 = 8,
    per_kilobyte = 1_024,
    per_megabytes = Bytes.per_kilobyte * 1_024
}

export const enum Entities {
    /* actual limit is 2^19, but this number is easier to remember */
    limit = 500_000
}
