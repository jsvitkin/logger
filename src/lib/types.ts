import { ILogTransport } from './interfaces';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LogContext {
  correlationId?: string;
  service: string;
  operation: string;
  data?: Record<string, unknown>;
  error?: Error;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context: LogContext;
}

export interface LoggerConfig {
  minLevel: LogLevel;
  transports: ILogTransport[];
  prettyPrint?: boolean;
  defaultContext?: Partial<LogContext>;
}