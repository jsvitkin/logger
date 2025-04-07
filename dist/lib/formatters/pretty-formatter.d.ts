import { ILogFormatter } from '../interfaces';
import { LogEntry } from '../types';
export declare class PrettyFormatter implements ILogFormatter {
    private colors;
    private readonly levelColors;
    constructor();
    format(entry: LogEntry): string;
    private formatContextData;
    private formatValue;
}
