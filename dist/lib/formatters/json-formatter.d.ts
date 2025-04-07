import { ILogFormatter } from '../interfaces';
import { LogEntry } from '../types';
export declare class JsonFormatter implements ILogFormatter {
    private defaultReplacer;
    format(entry: LogEntry, prettyPrint?: boolean, replacer?: (key: string, value: any) => any): string;
}
