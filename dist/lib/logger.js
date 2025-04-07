import { LogLevel } from './types';
export class Logger {
    transports;
    defaultContext;
    minLevel;
    constructor(config) {
        this.transports = config.transports;
        this.defaultContext = config.defaultContext || {};
        this.minLevel = config.minLevel || LogLevel.INFO;
    }
    error(message, context) {
        if (this.shouldLog(LogLevel.ERROR)) {
            const entry = this.createLogEntry(LogLevel.ERROR, message, context);
            this.transports.forEach((t) => t.log(entry));
        }
    }
    warn(message, context) {
        if (this.shouldLog(LogLevel.WARN)) {
            const entry = this.createLogEntry(LogLevel.WARN, message, context);
            this.transports.forEach((t) => t.log(entry));
        }
    }
    info(message, context) {
        if (this.shouldLog(LogLevel.INFO)) {
            const entry = this.createLogEntry(LogLevel.INFO, message, context);
            this.transports.forEach((t) => t.log(entry));
        }
    }
    debug(message, context) {
        if (this.shouldLog(LogLevel.DEBUG)) {
            const entry = this.createLogEntry(LogLevel.DEBUG, message, context);
            this.transports.forEach((t) => t.log(entry));
        }
    }
    shouldLog(level) {
        const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
        return levels.indexOf(level) >= levels.indexOf(this.minLevel);
    }
    formatDate(date) {
        const pad = (n) => n.toString().padStart(2, '0');
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    createLogEntry(level, message, context) {
        const mergedContext = {
            ...this.defaultContext,
            ...context,
            service: context?.service || this.defaultContext.service || 'unknown-service',
            operation: context?.operation || this.defaultContext.operation || 'unknown-operation',
        };
        return {
            timestamp: this.formatDate(new Date()),
            level: level,
            message: message,
            context: mergedContext,
        };
    }
}
