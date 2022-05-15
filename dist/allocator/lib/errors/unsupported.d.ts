export const UnsupportedOperationError: {
    new (msg?: string | undefined): {
        name: string;
        message: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export function unsupported(msg: any): never;
//# sourceMappingURL=unsupported.d.ts.map