export function defError(prefix: any, suffix?: (msg: any) => string): {
    new (msg: any): {
        name: string;
        message: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
//# sourceMappingURL=deferror.d.ts.map