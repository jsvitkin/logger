import { LogLevel } from './types';
export class Logger {
    transports;
    defaultContext;
    minLevel;
    /**
     * Constructs a new Logger with the given configuration.
     * @param config The configuration options for this logger.
     * The following options are available:
     * - `transports`: An array of {@link ILogTransport} objects to use for writing log entries.
     * - `defaultContext`: An object of default context to include with every log entry.
     * - `minLevel`: The minimum log level to allow writing to the log. Defaults to `LogLevel.INFO`.
     */
    constructor(config) {
        this.transports = config.transports;
        this.defaultContext = config.defaultContext || {};
        this.minLevel = config.minLevel || LogLevel.INFO;
    }
    /**
     * Logs an error message and optional context with the error log level.
     * @param message The error message to log.
     * @param context Optional context to include in the log entry.
     */
    error(message, context) {
        if (this.shouldLog(LogLevel.ERROR)) {
            const entry = this.createLogEntry(LogLevel.ERROR, message, context);
            this.transports.forEach((t) => t.log(entry));
        }
    }
    /**
     * Logs a warning message and optional context with the warn log level.
     * @param message The warning message to log.
     * @param context Optional context to include in the log entry.
     */
    warn(message, context) {
        if (this.shouldLog(LogLevel.WARN)) {
            const entry = this.createLogEntry(LogLevel.WARN, message, context);
            this.transports.forEach((t) => t.log(entry));
        }
    }
    /**
     * Logs an info message and optional context with the info log level.
     * @param message The info message to log.
     * @param context Optional context to include in the log entry.
     */
    info(message, context) {
        if (this.shouldLog(LogLevel.INFO)) {
            const entry = this.createLogEntry(LogLevel.INFO, message, context);
            this.transports.forEach((t) => t.log(entry));
        }
    }
    /**
     * Logs a debug message and optional context with the debug log level.
     * @param message The debug message to log.
     * @param context Optional context to include in the log entry.
     */
    debug(message, context) {
        if (this.shouldLog(LogLevel.DEBUG)) {
            const entry = this.createLogEntry(LogLevel.DEBUG, message, context);
            this.transports.forEach((t) => t.log(entry));
        }
    }
    shouldLog(level) {
        const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
        return levels.indexOf(level) >= levels.indexOf(this.minLevel);
    }
    formatDate(date) {
        const pad = (n) => n.toString().padStart(2, '0');
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    createLogEntry(level, message, context) {
        const mergedContext = {
            ...this.defaultContext,
            ...context,
            service: context?.service || this.defaultContext.service || 'unknown-service',
            operation: context?.operation || this.defaultContext.operation || 'unknown-operation',
        };
        return {
            timestamp: this.formatDate(new Date()),
            level: level,
            message: message,
            context: mergedContext,
        };
    }
}
