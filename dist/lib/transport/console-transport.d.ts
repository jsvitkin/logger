import { ILogFormatter, ILogTransport } from '../interfaces';
import { LogEntry } from '../types';
export declare class ConsoleTransport implements ILogTransport {
    private formatter;
    constructor(formatter: ILogFormatter);
    log(entry: LogEntry): void;
}
