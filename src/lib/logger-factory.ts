import { PrettyFormatter } from './formatters/pretty-formatter';
import { Logger } from './logger';
import { ConsoleTransport } from './transport/console-transport';
import { LoggerConfig, LogLevel } from './types';

export class LoggerFactory {
  private static loggers: Map<string, Logger> = new Map();
  private static defaultConfig?: LoggerConfig;
  private static initialized = false;
  private static configs: Record<string, LoggerConfig>;

  static initialize(configs: Record<string, LoggerConfig>) {
    this.defaultConfig = {
      transports: [new ConsoleTransport(new PrettyFormatter())],
      minLevel: LogLevel.INFO
    };
    this.configs = configs;
    this.initialized = true;
  }

  static get(serviceName: string): Logger {
    if (!this.initialized) {
      throw new Error('LoggerFactory must be initialized before use.');
    }
    const formattedServiceName = this.formatServiceName(serviceName);
    if (this.loggers.has(formattedServiceName)) {
      return this.loggers.get(formattedServiceName)!;
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

  private static formatServiceName(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
}