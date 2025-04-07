import { Logger } from './logger';
import { LoggerConfig } from './types';
export declare class LoggerFactory {
    private static loggers;
    private static defaultConfig?;
    private static initialized;
    private static configs;
    static initialize(configs: Record<string, LoggerConfig>): void;
    static get(serviceName: string): Logger;
    private static formatServiceName;
}
