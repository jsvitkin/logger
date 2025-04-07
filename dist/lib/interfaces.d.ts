import { LogEntry } from './types';
export interface ILogTransport {
    log(entry: LogEntry): void;
}
export interface ILogFormatter {
    format(entry: LogEntry): string;
}
