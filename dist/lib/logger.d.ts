import { LogContext, LoggerConfig } from './types';
export declare class Logger {
    private transports;
    private readonly defaultContext;
    private readonly minLevel;
    /**
     * Constructs a new Logger with the given configuration.
     * @param config The configuration options for this logger.
     * The following options are available:
     * - `transports`: An array of {@link ILogTransport} objects to use for writing log entries.
     * - `defaultContext`: An object of default context to include with every log entry.
     * - `minLevel`: The minimum log level to allow writing to the log. Defaults to `LogLevel.INFO`.
     */
    constructor(config: LoggerConfig);
    /**
     * Logs an error message and optional context with the error log level.
     * @param message The error message to log.
     * @param context Optional context to include in the log entry.
     */
    error(message: string, context?: Partial<LogContext>): void;
    /**
     * Logs a warning message and optional context with the warn log level.
     * @param message The warning message to log.
     * @param context Optional context to include in the log entry.
     */
    warn(message: string, context?: Partial<LogContext>): void;
    /**
     * Logs an info message and optional context with the info log level.
     * @param message The info message to log.
     * @param context Optional context to include in the log entry.
     */
    info(message: string, context?: Partial<LogContext>): void;
    /**
     * Logs a debug message and optional context with the debug log level.
     * @param message The debug message to log.
     * @param context Optional context to include in the log entry.
     */
    debug(message: string, context?: Partial<LogContext>): void;
    private shouldLog;
    private formatDate;
    private createLogEntry;
}
