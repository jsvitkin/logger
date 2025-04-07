import { ILogTransport } from '../interfaces';
import { LogEntry } from '../types';
export declare class SentryTransport implements ILogTransport {
    constructor(dsn: string, environment: string);
    log(entry: LogEntry): void;
}
