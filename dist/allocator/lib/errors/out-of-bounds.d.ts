export const OutOfBoundsError: {
    new (msg?: string | undefined): {
        name: string;
        message: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export function outOfBounds(index: any): never;
export function ensureIndex(index: any, min: any, max: any): false;
export function ensureIndex2(x: any, y: any, maxX: any, maxY: any): false;
//# sourceMappingURL=out-of-bounds.d.ts.map