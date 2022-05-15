export const IllegalArgumentError: {
    new (msg?: string | undefined): {
        name: string;
        message: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export function illegalArgs(msg: any): never;
//# sourceMappingURL=illegal-arguments.d.ts.map