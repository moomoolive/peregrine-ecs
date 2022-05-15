/**
 * Class behavior mixin based on:
 * {@link http://raganwald.com/2015/06/26/decorators-in-es7.html}
 *
 * Additionally only injects/overwrites properties in target, which are NOT
 * marked with `@nomixin` (i.e. those which haven't set their `configurable`
 * property descriptor flag to `false`)
 *
 * @param behaviour - to mixin
 * @param sharedBehaviour -
 * @returns decorator function
 */
export declare const mixin: (behaviour: any, sharedBehaviour?: any) => (clazz: any) => any;
//# sourceMappingURL=mixin.d.ts.map