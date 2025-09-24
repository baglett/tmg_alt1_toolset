/**
 * Standard logger implementation for TMG Alt1 Toolset applications
 * Provides consistent, categorized logging with visual indicators
 */

export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}

export class Alt1Logger {
    private appName: string;
    private logLevel: LogLevel;

    constructor(appName: string, logLevel: LogLevel = LogLevel.INFO) {
        this.appName = appName;
        this.logLevel = logLevel;
    }

    // Lifecycle logging
    init(message: string, ...args: any[]) {
        if (this.logLevel <= LogLevel.INFO) {
            console.log(`🚀 [${this.appName}] ${message}`, ...args);
        }
    }

    success(message: string, ...args: any[]) {
        if (this.logLevel <= LogLevel.INFO) {
            console.log(`✅ [${this.appName}] ${message}`, ...args);
        }
    }

    error(message: string, error?: any, ...args: any[]) {
        if (this.logLevel <= LogLevel.ERROR) {
            console.error(`❌ [${this.appName}] ${message}`, error, ...args);
        }
    }

    warn(message: string, ...args: any[]) {
        if (this.logLevel <= LogLevel.WARN) {
            console.warn(`⚠️ [${this.appName}] ${message}`, ...args);
        }
    }

    debug(message: string, ...args: any[]) {
        if (this.logLevel <= LogLevel.DEBUG) {
            console.log(`🐛 [${this.appName}] ${message}`, ...args);
        }
    }

    // Category-specific methods
    alt1(message: string, ...args: any[]) {
        if (this.logLevel <= LogLevel.INFO) {
            console.log(`🔧 [Alt1] ${message}`, ...args);
        }
    }

    window(message: string, ...args: any[]) {
        if (this.logLevel <= LogLevel.INFO) {
            console.log(`🪟 [Windows] ${message}`, ...args);
        }
    }

    ui(message: string, ...args: any[]) {
        if (this.logLevel <= LogLevel.INFO) {
            console.log(`🎮 [UI] ${message}`, ...args);
        }
    }

    perf(message: string, ...args: any[]) {
        if (this.logLevel <= LogLevel.DEBUG) {
            console.log(`📊 [Perf] ${message}`, ...args);
        }
    }

    ocr(message: string, ...args: any[]) {
        if (this.logLevel <= LogLevel.INFO) {
            console.log(`🔍 [OCR] ${message}`, ...args);
        }
    }

    data(message: string, ...args: any[]) {
        if (this.logLevel <= LogLevel.INFO) {
            console.log(`💾 [Data] ${message}`, ...args);
        }
    }

    network(message: string, ...args: any[]) {
        if (this.logLevel <= LogLevel.INFO) {
            console.log(`🌐 [Network] ${message}`, ...args);
        }
    }

    // Performance timing helpers
    time(operation: string) {
        console.time(`⏱️ [Perf] ${operation}`);
    }

    timeEnd(operation: string) {
        console.timeEnd(`⏱️ [Perf] ${operation}`);
    }

    // Group logging for complex operations
    group(label: string) {
        console.group(`📁 [${this.appName}] ${label}`);
    }

    groupEnd() {
        console.groupEnd();
    }
}