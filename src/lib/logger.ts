import { ILogTransport } from './interfaces';
import { LogContext, LogEntry, LoggerConfig, LogLevel } from './types';

export class Logger {
  private transports: ILogTransport[];
  private readonly defaultContext: Partial<LogContext>;
  private readonly minLevel: LogLevel;

  /**
   * Constructs a new Logger with the given configuration.
   * @param config The configuration options for this logger.
   * The following options are available:
   * - `transports`: An array of {@link ILogTransport} objects to use for writing log entries.
   * - `defaultContext`: An object of default context to include with every log entry.
   * - `minLevel`: The minimum log level to allow writing to the log. Defaults to `LogLevel.INFO`.
   */
  constructor(config: LoggerConfig) {
    this.transports = config.transports;
    this.defaultContext = config.defaultContext || {};
    this.minLevel = config.minLevel || LogLevel.INFO;
  }

  /**
   * Logs an error message and optional context with the error log level.
   * @param message The error message to log.
   * @param context Optional context to include in the log entry.
   */
  public error(message: string, context?: Partial<LogContext>) {
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
  public warn(message: string, context?: Partial<LogContext>) {
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
  public info(message: string, context?: Partial<LogContext>) {
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
  public debug(message: string, context?: Partial<LogContext>) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const entry = this.createLogEntry(LogLevel.DEBUG, message, context);
      this.transports.forEach((t) => t.log(entry));
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(this.minLevel);
  }

  private formatDate(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${ year }-${ month }-${ day } ${ hours }:${ minutes }:${ seconds }`;
  }

  private createLogEntry(level: LogLevel, message: string, context?: Partial<LogContext>): LogEntry {
    const mergedContext: LogContext = {
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