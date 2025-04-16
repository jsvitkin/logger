interface ILogTransport {
    /**
     * Logs the given log entry.
     *
     * @param entry The log entry to log.
     */
    log(entry: LogEntry): void;
}
interface ILogFormatter {
    /**
     * Format a log entry as a string.
     *
     * @param entry The log entry to format.
     * @returns A string representation of the log entry.
     */
    format(entry: LogEntry): string;
}

declare enum LogLevel {
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error"
}
interface LogContext {
    correlationId?: string;
    service: string;
    operation: string;
    data?: Record<string, unknown>;
    error?: Error;
}
interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    context: LogContext;
}
interface LoggerConfig {
    minLevel: LogLevel;
    transports: ILogTransport[];
    prettyPrint?: boolean;
    defaultContext?: Partial<LogContext>;
}

declare class Logger {
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

declare class LoggerFactory {
    private static loggers;
    private static defaultConfig?;
    private static initialized;
    private static configs;
    /**
     * Initialize the logger factory with the given config.
     * This method should be called once before any loggers are created.
     * @param configs - A mapping of service names to their respective logger configurations.
     */
    static initialize(configs: Record<string, LoggerConfig>): void;
    /**
     * Retrieve a logger instance for the given service name.
     * If the logger has already been created, the cached instance is returned.
     * Otherwise, a new logger is created based on the default config and any
     * service-specific config provided during initialization.
     * @param serviceName - The name of the service to log for.
     * @returns A Logger instance for the given service name.
     */
    static get(serviceName: string): Logger;
    private static formatServiceName;
}

declare class PrettyFormatter implements ILogFormatter {
    private colors;
    private readonly levelColors;
    constructor();
    /**
     * Format a log entry as a string.
     *
     * @param entry The log entry to format.
     * @returns A string representation of the log entry.
     */
    format(entry: LogEntry): string;
    private formatContextData;
    private formatValue;
}

declare class JsonFormatter implements ILogFormatter {
    private defaultReplacer;
    /**
     * Format a log entry into a JSON string.
     *
     * @param entry the log entry to format
     * @param prettyPrint whether to pretty-print the JSON string
     * @param replacer a replacer function to use when stringifying the object
     * @returns a JSON string representation of the log entry
     */
    format(entry: LogEntry, prettyPrint?: boolean, replacer?: (key: string, value: any) => any): string;
}

declare class ConsoleTransport implements ILogTransport {
    private formatter;
    constructor(formatter: ILogFormatter);
    log(entry: LogEntry): void;
}

declare class SentryTransport implements ILogTransport {
    constructor(dsn: string, environment: string);
    log(entry: LogEntry): void;
}

export { ConsoleTransport, JsonFormatter, LogLevel, Logger, type LoggerConfig, LoggerFactory, PrettyFormatter, SentryTransport };
