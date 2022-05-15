export const IllegalArityError: {
    new (msg?: string | undefined): {
        name: string;
        message: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export function illegalArity(n: any): never;
//# sourceMappingURL=illegal-arity.d.ts.map