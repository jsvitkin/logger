import { ILogFormatter } from '../interfaces';
import { LogEntry } from '../types';
export declare class PrettyFormatter implements ILogFormatter {
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
