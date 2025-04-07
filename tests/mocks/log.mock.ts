import { LogEntry, LogLevel } from '../../src/lib/types';

export const mockLog: LogEntry = {
  timestamp: '2025-02-11T14:43:18+01:00',
  level: LogLevel.INFO,
  message: 'Test message',
  context: {
    service: 'test-service',
    operation: 'test-operation',
    data: {
      key: 'vale',
    },
  },
};

export const mockLogJSONOutput: string =
  '{"timestamp":"2025-02-11T14:43:18+01:00","level":"info","message":"Test message","context":{"service":"test-service","operation":"test-operation","data":{"key":"vale"}}}';

export const mockLogPrettyJSONOutput = `{
  "timestamp": "2025-02-11T14:43:18+01:00",
  "level": "info",
  "message": "Test message",
  "context": {
    "service": "test-service",
    "operation": "test-operation",
    "data": {
      "key": "vale"
    }
  }
}`;