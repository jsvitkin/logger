import { LoggerFactory } from '../src';
import { LogLevel } from '../src/lib/types';

describe('LoggerFactory', () => {
  beforeEach(() => {
    // Reset LoggerFactory state
    (LoggerFactory as any).loggers = new Map();
    (LoggerFactory as any).defaultConfig = undefined;
    (LoggerFactory as any).initialized = false;
  });

  describe('initialization', () => {
    it('should throw error if not initialized', () => {
      expect(() => LoggerFactory.get('test-service')).toThrow('LoggerFactory must be initialized');
    });

    it('should use default config if no service config provided', () => {
      LoggerFactory.initialize({});
      const logger = LoggerFactory.get('test-service');
      expect(logger).toBeDefined();
      expect((logger as any).defaultContext.service).toBe('test-service');
    });
  });

  describe('service name formatting', () => {
    beforeEach(() => {
      LoggerFactory.initialize({});
    });

    it.each([
      ['User Service', 'user-service'],
      ['USER_SERVICE', 'user-service'],
      ['user-service', 'user-service'],
      ['  User  Service  ', 'user-service'],
      ['User@Service', 'user-service'],
      ['User---Service', 'user-service'],
    ])('should format "%s" to "%s"', (input, expected) => {
      const logger = LoggerFactory.get(input);
      expect((logger as any).defaultContext.service).toBe(expected);
    });
  });

  describe('logger caching', () => {
    beforeEach(() => {
      LoggerFactory.initialize({});
    });

    it('should return same logger instance for same service', () => {
      const logger1 = LoggerFactory.get('user-service');
      const logger2 = LoggerFactory.get('user-service');
      expect(logger1).toBe(logger2);
    });

    it('should return same logger instance for differently formatted names', () => {
      const logger1 = LoggerFactory.get('User Service');
      const logger2 = LoggerFactory.get('user-service');
      expect(logger1).toBe(logger2);
    });
  });

  describe('config merging', () => {
    beforeEach(() => {

      LoggerFactory.initialize({
        'test-service': {
          transports: [],
          minLevel: LogLevel.ERROR,
          defaultContext: {
            operation: 'custom-operation'
          }
        }
      });
    });

    it('should merge service config with default config', () => {
      const logger = LoggerFactory.get('test-service');
      const context = (logger as any).defaultContext;

      expect(context.service).toBe('test-service');
      expect(context.operation).toBe('custom-operation');
      expect((logger as any).minLevel).toBe(LogLevel.ERROR);
    });
  });
});