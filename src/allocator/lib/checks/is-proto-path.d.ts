/**
 * Returns true, if given `x` is an illegal object key as per
 * {@link ILLEGAL_KEYS}.
 *
 * @see {@link isProtoPath} for more details
 *
 * @param x -
 */
export declare const isIllegalKey: (x: any) => boolean;
/**
 * Returns true if given `path` contains any {@link ILLEGAL_KEYS}, i.e. could be
 * used to poison the prototype chain of an object.
 *
 * @remarks
 * If given an array, each item is considered a single sub-path property and
 * will be checked as is. If given a string it will be split using "." as
 * delimiter and each item checked as is (same way array paths are handled).
 *
 * Original discussion here, implementation updated to be more encompassing:
 * https://github.com/thi-ng/umbrella/pull/273
 *
 * @param path -
 */
export declare const isProtoPath: (path: string | number | readonly (string | number)[]) => boolean;
//# sourceMappingURL=is-proto-path.d.ts.map