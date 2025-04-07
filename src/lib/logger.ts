import { ILogTransport } from './interfaces';
import { LogContext, LogEntry, LoggerConfig, LogLevel } from './types';

export class Logger {
  private transports: ILogTransport[];
  private readonly defaultContext: Partial<LogContext>;
  private readonly minLevel: LogLevel;

  constructor(config: LoggerConfig) {
    this.transports = config.transports;
    this.defaultContext = config.defaultContext || {};
    this.minLevel = config.minLevel || LogLevel.INFO;
  }

  public error(message: string, context?: Partial<LogContext>) {
    if (this.shouldLog(LogLevel.ERROR)) {
      const entry = this.createLogEntry(LogLevel.ERROR, message, context);
      this.transports.forEach((t) => t.log(entry));
    }
  }

  public warn(message: string, context?: Partial<LogContext>) {
    if (this.shouldLog(LogLevel.WARN)) {
      const entry = this.createLogEntry(LogLevel.WARN, message, context);
      this.transports.forEach((t) => t.log(entry));
    }
  }

  public info(message: string, context?: Partial<LogContext>) {
    if (this.shouldLog(LogLevel.INFO)) {
      const entry = this.createLogEntry(LogLevel.INFO, message, context);
      this.transports.forEach((t) => t.log(entry));
    }
  }

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

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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