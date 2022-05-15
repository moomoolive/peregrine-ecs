/**
 * Returns true iff `x` implements {@link IDeref}.
 *
 * @param x -
 */
export const isDeref = (x) => x != null && typeof x["deref"] === "function";
/**
 * If `x` implements {@link IDeref}, returns its wrapped value, else
 * returns `x` itself.
 *
 * @param x -
 */
export const deref = (x) => (isDeref(x) ? x.deref() : x);
