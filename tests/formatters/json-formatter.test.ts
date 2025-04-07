import { JsonFormatter } from '../../src';
import { mockLog, mockLogJSONOutput, mockLogPrettyJSONOutput } from '../mocks/log.mock';
import { LogEntry } from '../../src/lib/types';
import { jest } from '@jest/globals';

let formatter: JsonFormatter;
describe('JsonFormatter', () => {
  describe('format', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      formatter = new JsonFormatter();
    });
    it('should format log entry as JSON string', () => {
      const output = formatter.format(mockLog, false);
      expect(typeof output).toEqual('string');
      expect(output).toEqual(mockLogJSONOutput);
      expect(output).not.toBeNull();
      expect(output).not.toBeUndefined();
    });

    it('should format log entry with pretty print when enabled', () => {
      const output = formatter.format(mockLog, true);
      expect(typeof output).toEqual('string');
      expect(output).toEqual(mockLogPrettyJSONOutput);
      expect(output).not.toBeNull();
      expect(output).not.toBeUndefined();
    });

    it('should format log entry without pretty print by default', () => {
      const output = formatter.format(mockLog);
      expect(output).toEqual(mockLogJSONOutput);
      expect(output).not.toEqual(mockLogPrettyJSONOutput);
      expect(output).not.toBeNull();
      expect(output).not.toBeUndefined();
    });

    it('should apply replacer function when provided', () => {
      const replacer = (key: string, value: any) => {
        if (key === 'key') return 'newValue';
        return value;
      };
      const expected = JSON.stringify({
        ...mockLog,
        context: {
          ...mockLog.context,
          data: {
            ...mockLog.context.data,
            key: 'newValue',
          },
        },
      });
      const output = formatter.format(mockLog, false, replacer);

      expect(output).toEqual(expected);
      expect(output).not.toBeNull();
      expect(output).not.toBeUndefined();
    });

    it('should handle complex data types in context', () => {
      const complexLog: LogEntry = {
        ...mockLog,
        context: {
          ...mockLog.context,
          data: {
            ...mockLog.context.data,
            date: new Date('2022-01-01T00:00:00.000Z'),
            regex: /test/,
            array: [1, 2, 3],
            nested: { key: 'value' },
          },
        },
      };
      const expected = JSON.stringify({
        ...complexLog,
        context: {
          ...complexLog.context,
          data: {
            ...complexLog.context.data,
            date: '2022-01-01T00:00:00.000Z',
            regex: '/test/',
            array: [1, 2, 3],
            nested: { key: 'value' },
          },
        },
      });
      const output = formatter.format(complexLog);

      expect(output).toEqual(expected);
    });

    it('should handle error objects in context', () => {
      const errorLog: LogEntry = {
        ...mockLog,
        context: {
          ...mockLog.context,
          error: new Error('Test error'),
        },
      };
      const expected = JSON.stringify({
        ...errorLog,
        context: {
          ...errorLog.context,
          error: errorLog.context.error && {
            message: errorLog.context.error.message,
            name: errorLog.context.error.name,
            stack: errorLog.context.error.stack,
          },
        },
      });
      const output = formatter.format(errorLog);

      expect(output).toEqual(expected);
    });

    it('should handle missing optional context fields', () => {
      const minimalLog: LogEntry = {
        timestamp: mockLog.timestamp,
        level: mockLog.level,
        message: mockLog.message,
        context: {
          service: 'test-service',
          operation: 'test-operation'
        },
      };
      const expected = JSON.stringify(minimalLog);
      const output = formatter.format(minimalLog);

      expect(output).toEqual(expected);
    });
  });
});