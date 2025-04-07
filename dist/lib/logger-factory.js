import { PrettyFormatter } from './formatters/pretty-formatter';
import { Logger } from './logger';
import { ConsoleTransport } from './transport/console-transport';
import { LogLevel } from './types';
export class LoggerFactory {
    static loggers = new Map();
    static defaultConfig;
    static initialized = false;
    static configs;
    static initialize(configs) {
        this.defaultConfig = {
            transports: [new ConsoleTransport(new PrettyFormatter())],
            minLevel: LogLevel.INFO
        };
        this.configs = configs;
        this.initialized = true;
    }
    static get(serviceName) {
        if (!this.initialized) {
            throw new Error('LoggerFactory must be initialized before use.');
        }
        const formattedServiceName = this.formatServiceName(serviceName);
        if (this.loggers.has(formattedServiceName)) {
            return this.loggers.get(formattedServiceName);
        }
        if (!this.defaultConfig) {
            throw new Error('Default config not initialized');
        }
        const config = {
            ...this.defaultConfig,
            ...this.configs?.[formattedServiceName],
            transports: [
                ...this.defaultConfig.transports,
                ...(this.configs?.[formattedServiceName]?.transports || [])
            ],
            defaultContext: {
                ...this.defaultConfig.defaultContext,
                ...this.configs?.[formattedServiceName]?.defaultContext,
                service: formattedServiceName,
            },
        };
        const logger = new Logger(config);
        this.loggers.set(formattedServiceName, logger);
        return logger;
    }
    static formatServiceName(name) {
        return name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }
}
