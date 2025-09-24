/**
 * Standard logger implementation for TMG Alt1 Toolset applications
 * Provides consistent, categorized logging with visual indicators
 */
export declare enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}
export declare class Alt1Logger {
    private appName;
    private logLevel;
    constructor(appName: string, logLevel?: LogLevel);
    init(message: string, ...args: any[]): void;
    success(message: string, ...args: any[]): void;
    error(message: string, error?: any, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    debug(message: string, ...args: any[]): void;
    alt1(message: string, ...args: any[]): void;
    window(message: string, ...args: any[]): void;
    ui(message: string, ...args: any[]): void;
    perf(message: string, ...args: any[]): void;
    ocr(message: string, ...args: any[]): void;
    data(message: string, ...args: any[]): void;
    network(message: string, ...args: any[]): void;
    time(operation: string): void;
    timeEnd(operation: string): void;
    group(label: string): void;
    groupEnd(): void;
}
//# sourceMappingURL=logger.d.ts.map