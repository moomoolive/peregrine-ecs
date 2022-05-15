import type { Fn, Fn0, Fn2 } from "./fn.js";
/**
 * Predicate function mapping given value to true/false.
 */
export declare type Predicate<T> = Fn<T, boolean>;
/**
 * Predicate function mapping given args to true/false.
 */
export declare type Predicate2<T> = Fn2<T, T, boolean>;
/**
 * Higher order {@link Predicate} builder. Possibly stateful.
 */
export declare type StatefulPredicate<T> = Fn0<Predicate<T>>;
/**
 * Higher order {@link Predicate2} builder. Possibly stateful.
 */
export declare type StatefulPredicate2<T> = Fn0<Predicate2<T>>;
//# sourceMappingURL=predicate.d.ts.map