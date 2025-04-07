import { LogEntry } from './types';

export interface ILogTransport {
  /**
   * Logs the given log entry.
   *
   * @param entry The log entry to log.
   */
  log(entry: LogEntry): void;
}

export interface ILogFormatter {
  /**
   * Format a log entry as a string.
   *
   * @param entry The log entry to format.
   * @returns A string representation of the log entry.
   */
  format(entry: LogEntry): string;
}