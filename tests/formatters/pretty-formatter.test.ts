import { PrettyFormatter } from '../../src';
import { LogEntry, LogLevel } from '../../src/lib/types';
import { mockLog } from '../mocks/log.mock';
import { jest } from '@jest/globals';

describe('PrettyFormatter', () => {
  let formatter: PrettyFormatter;

  describe('format', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      formatter = new PrettyFormatter();
    });

    it('should format basic log entry with all required fields', () => {
      const output = formatter.format(mockLog);
      expect(output).toContain('[2025-02-11T14:43:18+01:00]');
      expect(output).toContain('INFO');
      expect(output).toContain('[test-service:test-operation]');
      expect(output).toContain('Test message');
      expect(output).toContain('key="vale"');
    });

    it('should format log entry with different log levels in correct colors', () => {
      const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
      const colorCodes = {
        [LogLevel.DEBUG]: '\x1b[90m', // gray
        [LogLevel.INFO]: '\x1b[36m',  // cyan
        [LogLevel.WARN]: '\x1b[33m',  // yellow
        [LogLevel.ERROR]: '\x1b[31m', // red
      };

      levels.forEach(level => {
        const entry: LogEntry = { ...mockLog, level };
        const output = formatter.format(entry);
        expect(output).toContain(`${ colorCodes[level] }${ level.toUpperCase() }\x1b[0m`);
      });
    });

    it('should format error objects in context', () => {
      const error = new Error('Test error');
      const errorEntry: LogEntry = {
        ...mockLog,
        level: LogLevel.ERROR,
        context: {
          ...mockLog.context,
          error,
        },
      };

      const output = formatter.format(errorEntry);
      expect(output).toContain('error="Error: Test error"');
      expect(output).toContain(error.stack);
    });

    it('should format complex data types in context', () => {
      const complexEntry: LogEntry = {
        ...mockLog,
        context: {
          ...mockLog.context,
          data: {
            string: 'value',
            number: 123,
            boolean: true,
            array: [1, 2, 3],
            nested: {
              key: 'value',
            },
            date: new Date('2025-02-17T12:30:31+01:00'),
          },
        },
      };

      const output = formatter.format(complexEntry);
      expect(output).toContain('string="value"');
      expect(output).toContain('number=123');
      expect(output).toContain('boolean=true');
      expect(output).toContain('array=[1,2,3]');
      expect(output).toContain('nested={key:"value"}');
    });

    it('should handle missing optional context fields', () => {
      const minimalEntry: LogEntry = {
        timestamp: mockLog.timestamp,
        level: mockLog.level,
        message: mockLog.message,
        context: {
          service: mockLog.context.service,
          operation: mockLog.context.operation,
        },
      };

      const output = formatter.format(minimalEntry);
      expect(output).toContain('[test-service:test-operation]');
      expect(output).not.toContain('undefined');
      expect(output).not.toContain('null');
    });

    it('should handle RegExp in context data', () => {
      const regexEntry: LogEntry = {
        ...mockLog,
        context: {
          ...mockLog.context,
          data: {
            regex: /test-pattern/,
          },
        },
      };

      const output = formatter.format(regexEntry);
      expect(output).toContain('regex=/test-pattern/');
    });
  });
});