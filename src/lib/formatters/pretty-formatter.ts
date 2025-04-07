import { ILogFormatter } from '../interfaces';
import { LogContext, LogEntry, LogLevel } from '../types';

export class PrettyFormatter implements ILogFormatter {
  private colors: Record<string, string>;
  private readonly levelColors: Record<string, string>;

  constructor() {
    this.colors = {
      red: '\x1b[31m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      cyan: '\x1b[36m',
      gray: '\x1b[90m',
      brightRed: '\x1b[91m',
      brightYellow: '\x1b[93m',
      brightBlue: '\x1b[94m',
      brightCyan: '\x1b[96m',
      reset: '\x1b[0m',
    };
    this.levelColors = {
      [LogLevel.DEBUG]: this.colors.gray,
      [LogLevel.ERROR]: this.colors.red,
      [LogLevel.INFO]: this.colors.cyan,
      [LogLevel.WARN]: this.colors.yellow,
    };
  }

  format(entry: LogEntry): string {
    const coloredLevel = `${this.levelColors[entry.level]}${entry.level.toUpperCase()}${this.colors.reset}`;
    return `[${entry.timestamp}] ${coloredLevel}  [${entry.context.service}:${entry.context.operation}] ${entry.message} | ${this.formatContextData(entry.context)}`;
  }

  private formatContextData(context: LogContext): string {
    if (!context.data && !context.error) {
      return '';
    }

    if (context.error) {
      return `error="${context.error.name}: ${context.error.message}" ${context.error.stack ? `\n ${context.error.stack}` : ''}`;
    }

    if (context.data) {
      return Object.entries(context.data)
        .map(([key, value]) => `${key}=${this.formatValue(value)}`)
        .join(' ');
    }
    return '';
  }

  private formatValue(value: unknown): string {
    if (typeof value === 'string') return `"${value}"`;
    if (Array.isArray(value)) return `[${value.map((v) => this.formatValue(v))}]`;
    if (value instanceof RegExp) return value.toString();
    if (typeof value === 'object' && value !== null) {
      return `{${Object.entries(value)
        .map(([k, v]) => `${k}:${this.formatValue(v)}`)
        .join(',')}}`;
    }

    return String(value);
  }
}