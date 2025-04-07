import { ILogFormatter, ILogTransport } from '../interfaces';
import { LogEntry, LogLevel } from '../types';

export class ConsoleTransport implements ILogTransport {
  private formatter: ILogFormatter;

  constructor(formatter: ILogFormatter) {
    this.formatter = formatter;
  }

  log(entry: LogEntry): void {
    let formattedLog: string;
    try {
      formattedLog = this.formatter.format(entry);
    } catch (error) {
      console.error('failed to format log entry: ', error);
      console.log(entry);
      return;
    }

    switch (entry.level) {
      case LogLevel.ERROR:
        console.error(formattedLog);
        break;
      case LogLevel.WARN:
        console.warn(formattedLog);
        break;
      case LogLevel.INFO:
        console.info(formattedLog);
        break;
      case LogLevel.DEBUG:
        console.debug(formattedLog);
        break;
      default:
        console.log(formattedLog);
        break;
    }
  }
}