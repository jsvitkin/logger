import { Logger } from './logger';
import { LoggerConfig } from './types';
export declare class LoggerFactory {
    private static loggers;
    private static defaultConfig?;
    private static initialized;
    private static configs;
    /**
     * Initialize the logger factory with the given config.
     * This method should be called once before any loggers are created.
     * @param configs - A mapping of service names to their respective logger configurations.
     */
    static initialize(configs: Record<string, LoggerConfig>): void;
    /**
     * Retrieve a logger instance for the given service name.
     * If the logger has already been created, the cached instance is returned.
     * Otherwise, a new logger is created based on the default config and any
     * service-specific config provided during initialization.
     * @param serviceName - The name of the service to log for.
     * @returns A Logger instance for the given service name.
     */
    static get(serviceName: string): Logger;
    private static formatServiceName;
}
