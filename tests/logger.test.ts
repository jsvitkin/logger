import { Logger } from '../src';
import { ILogTransport } from '../src/lib/interfaces';
import { LogEntry, LogLevel } from '../src/lib/types';
import { jest } from '@jest/globals';

describe('Logger', () => {
  let logger: Logger;
  let mockTransport: ILogTransport;
  let loggedEntries: LogEntry[];

  beforeEach(() => {
    loggedEntries = [];
    mockTransport = {
      log: jest.fn().mockImplementation((entry) => {
        loggedEntries.push(entry as LogEntry);
      }),
    };
  });

  describe('log level filtering', () => {
    it.each([
      [LogLevel.DEBUG, true, true, true, true], // DEBUG shows all levels
      [LogLevel.INFO, false, true, true, true], // INFO shows info, warn, error
      [LogLevel.WARN, false, false, true, true], // WARN shows warn, error
      [LogLevel.ERROR, false, false, false, true], // ERROR only shows error
    ])(
      'with minLevel %s, debug=%s, info=%s, warn=%s, error=%s',
      (minLevel, shouldDebug, shouldInfo, shouldWarn, shouldError) => {
        logger = new Logger({ transports: [mockTransport], minLevel });

        logger.debug('debug message');
        logger.info('info message');
        logger.warn('warn message');
        logger.error('error message');

        expect(loggedEntries.some(e => e.level === LogLevel.DEBUG)).toBe(shouldDebug);
        expect(loggedEntries.some(e => e.level === LogLevel.INFO)).toBe(shouldInfo);
        expect(loggedEntries.some(e => e.level === LogLevel.WARN)).toBe(shouldWarn);
        expect(loggedEntries.some(e => e.level === LogLevel.ERROR)).toBe(shouldError);
      }
    );
  });

  describe('context handling', () => {
    beforeEach(() => {
      logger = new Logger({
        transports: [mockTransport],
        minLevel: LogLevel.DEBUG,
        defaultContext: {
          service: 'default-service',
          operation: 'default-operation',
          data: { default: true },
        },
      });
    });

    it('should use default context when no context provided', () => {
      logger.info('test message');

      expect(loggedEntries[0].context.service).toBe('default-service');
      expect(loggedEntries[0].context.operation).toBe('default-operation');
      expect(loggedEntries[0].context.data).toEqual({ default: true });
    });

    it('should merge provided context with default context', () => {
      logger.info('test message', {
        operation: 'custom-operation',
        data: { custom: true },
      });

      expect(loggedEntries[0].context.service).toBe('default-service');
      expect(loggedEntries[0].context.operation).toBe('custom-operation');
      expect(loggedEntries[0].context.data).toEqual({ custom: true });
    });

    it('should use unknown-service/operation when neither default nor custom provided', () => {
      logger = new Logger({ transports: [mockTransport], minLevel: LogLevel.DEBUG });
      logger.info('test message');

      expect(loggedEntries[0].context.service).toBe('unknown-service');
      expect(loggedEntries[0].context.operation).toBe('unknown-operation');
    });
  });

  describe('timestamp formatting', () => {
    beforeEach(() => {
      logger = new Logger({ transports: [mockTransport], minLevel: LogLevel.DEBUG });
    });

    it('should format timestamp as YYYY-MM-DD HH:mm:ss', () => {
      const timestampRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

      logger.info('test message');

      expect(loggedEntries[0].timestamp).toMatch(timestampRegex);
    });

    it('should generate valid dates', () => {
      logger.info('test message');

      const timestamp = loggedEntries[0].timestamp;
      const [datePart, timePart] = timestamp.split(' ');
      const [year, month, day] = datePart.split('-').map(Number);
      const [hour, minute, second] = timePart.split(':').map(Number);

      expect(year).toBeGreaterThanOrEqual(2024);
      expect(month).toBeGreaterThanOrEqual(1);
      expect(month).toBeLessThanOrEqual(12);
      expect(day).toBeGreaterThanOrEqual(1);
      expect(day).toBeLessThanOrEqual(31);
      expect(hour).toBeLessThanOrEqual(23);
      expect(minute).toBeLessThanOrEqual(59);
      expect(second).toBeLessThanOrEqual(59);
    });
  });
});