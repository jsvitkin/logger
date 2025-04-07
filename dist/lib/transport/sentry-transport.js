import * as Sentry from '@sentry/node';
export class SentryTransport {
    constructor(dsn, environment) {
        Sentry.init({
            dsn,
            environment
        });
    }
    log(entry) {
        const { message, level, context } = entry;
        if (context.error) {
            Sentry.captureException(context.error, {
                extra: context.data,
                tags: {
                    service: context.service,
                    operation: context.operation
                }
            });
        }
        else {
            Sentry.captureMessage(message, {
                level: level,
                extra: context.data,
                tags: {
                    service: context.service,
                    operation: context.operation
                },
            });
        }
    }
}
