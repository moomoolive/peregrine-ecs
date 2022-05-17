export const enum bytes {
    i32 = 4,
    u8 = 1,
    f64 = 8,
    per_kilobyte = 1_024,
    per_megabyte = bytes.per_kilobyte * 1_024
}
