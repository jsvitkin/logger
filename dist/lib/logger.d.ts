import { LogContext, LoggerConfig } from './types';
export declare class Logger {
    private transports;
    private readonly defaultContext;
    private readonly minLevel;
    constructor(config: LoggerConfig);
    error(message: string, context?: Partial<LogContext>): void;
    warn(message: string, context?: Partial<LogContext>): void;
    info(message: string, context?: Partial<LogContext>): void;
    debug(message: string, context?: Partial<LogContext>): void;
    private shouldLog;
    private formatDate;
    private createLogEntry;
}
