import { ConsoleTransport } from '../../src';
import { ILogFormatter } from '../../src/lib/interfaces';
import { LogEntry, LogLevel } from '../../src/lib/types';
import { mockLog } from '../mocks/log.mock';
import { jest } from '@jest/globals';

describe('ConsoleTransport', () => {
  let transport: ConsoleTransport;
  let mockFormatter: ILogFormatter;
  let consoleErrorSpy: ReturnType<typeof jest.spyOn>;
  let consoleWarnSpy: ReturnType<typeof jest.spyOn>;
  let consoleInfoSpy: ReturnType<typeof jest.spyOn>;
  let consoleDebugSpy: ReturnType<typeof jest.spyOn>;
  let consoleLogSpy: ReturnType<typeof jest.spyOn>;

  beforeEach(() => {
    // Create mock formatter
    mockFormatter = {
      format: jest.fn<(entry: LogEntry) => string>().mockReturnValue('formatted log message'),
    };

    // Create transport with mock formatter
    transport = new ConsoleTransport(mockFormatter);

    // Spy on console methods
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
    });
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {
    });
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {
    });
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation(() => {
    });
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should use formatter to format log entry', () => {
    transport.log(mockLog);
    expect(mockFormatter.format).toHaveBeenCalledWith(mockLog);
  });

  it.each([
    [LogLevel.ERROR, 'error'],
    [LogLevel.WARN, 'warn'],
    [LogLevel.INFO, 'info'],
    [LogLevel.DEBUG, 'debug'],
  ])('should use console.%s for %s level', (level, method) => {
    const entry: LogEntry = { ...mockLog, level };
    transport.log(entry);

    // Get the appropriate spy based on the method
    const spy = {
      error: consoleErrorSpy,
      warn: consoleWarnSpy,
      info: consoleInfoSpy,
      debug: consoleDebugSpy,
    }[method];

    expect(spy).toHaveBeenCalledWith('formatted log message');
  });

  it('should use console.log for unknown log level', () => {
    const entry = { ...mockLog, level: 'UNKNOWN' as LogLevel };
    transport.log(entry);
    expect(consoleLogSpy).toHaveBeenCalledWith('formatted log message');
  });

  it('should handle formatter errors gracefully', () => {
    const errorFormatter: ILogFormatter = {
      format: jest.fn<(entry: LogEntry) => string>().mockImplementation(() => {
        throw new Error('Formatter error');
      }),
    };
    const errorTransport = new ConsoleTransport(errorFormatter);

    errorTransport.log(mockLog);

    expect(consoleErrorSpy).toHaveBeenCalledWith('failed to format log entry: ', expect.any(Error));
    expect(consoleLogSpy).toHaveBeenCalledWith(mockLog);
  });
});