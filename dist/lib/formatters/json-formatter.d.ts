import { ILogFormatter } from '../interfaces';
import { LogEntry } from '../types';
export declare class JsonFormatter implements ILogFormatter {
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
