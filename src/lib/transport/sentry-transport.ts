import { ILogTransport } from '../interfaces';
import * as Sentry from '@sentry/node'
import { SeverityLevel } from '@sentry/node';
import { LogEntry } from '../types';

export class SentryTransport implements ILogTransport {
  constructor(dsn: string, environment: string) {
    Sentry.init({
      dsn,
      environment
    });
  }

  log(entry: LogEntry): void {
    const { message, level, context } = entry;

    if (context.error) {
      Sentry.captureException(context.error, {
        extra: context.data,
        tags: {
          service: context.service,
          operation: context.operation
        }
      });
    } else {
      Sentry.captureMessage(message, {
        level: level as SeverityLevel,
        extra: context.data,
        tags: {
          service: context.service,
          operation: context.operation
        },
      });
    }
  }
}