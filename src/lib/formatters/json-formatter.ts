import { ILogFormatter } from '../interfaces';
import { LogEntry } from '../types';

export class JsonFormatter implements ILogFormatter {
  private defaultReplacer(_key: string, value: any): any {
    if (value instanceof RegExp) {
      return value.toString();
    }
    if (value instanceof Error) {
      return {
        message: value.message,
        name: value.name,
        stack: value.stack,
      };
    }
    return value;
  }

  /**
   * Format a log entry into a JSON string.
   *
   * @param entry the log entry to format
   * @param prettyPrint whether to pretty-print the JSON string
   * @param replacer a replacer function to use when stringifying the object
   * @returns a JSON string representation of the log entry
   */
  format(
    entry: LogEntry,
    prettyPrint: boolean = false,
    replacer?: (key: string, value: any) => any
  ): string {
    const finalReplacer = replacer || this.defaultReplacer.bind(this);
    return JSON.stringify(entry, finalReplacer, prettyPrint ? 2 : undefined);
  }
}