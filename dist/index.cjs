"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ConsoleTransport: () => ConsoleTransport,
  JsonFormatter: () => JsonFormatter,
  LogLevel: () => LogLevel,
  Logger: () => Logger,
  LoggerFactory: () => LoggerFactory,
  PrettyFormatter: () => PrettyFormatter,
  SentryTransport: () => SentryTransport
});
module.exports = __toCommonJS(index_exports);

// src/lib/types.ts
var LogLevel = /* @__PURE__ */ ((LogLevel2) => {
  LogLevel2["DEBUG"] = "debug";
  LogLevel2["INFO"] = "info";
  LogLevel2["WARN"] = "warn";
  LogLevel2["ERROR"] = "error";
  return LogLevel2;
})(LogLevel || {});

// src/lib/formatters/pretty-formatter.ts
var PrettyFormatter = class {
  colors;
  levelColors;
  constructor() {
    this.colors = {
      red: "\x1B[31m",
      yellow: "\x1B[33m",
      blue: "\x1B[34m",
      cyan: "\x1B[36m",
      gray: "\x1B[90m",
      brightRed: "\x1B[91m",
      brightYellow: "\x1B[93m",
      brightBlue: "\x1B[94m",
      brightCyan: "\x1B[96m",
      reset: "\x1B[0m"
    };
    this.levelColors = {
      ["debug" /* DEBUG */]: this.colors.gray,
      ["error" /* ERROR */]: this.colors.red,
      ["info" /* INFO */]: this.colors.cyan,
      ["warn" /* WARN */]: this.colors.yellow
    };
  }
  /**
   * Format a log entry as a string.
   *
   * @param entry The log entry to format.
   * @returns A string representation of the log entry.
   */
  format(entry) {
    const coloredLevel = `${this.levelColors[entry.level]}${entry.level.toUpperCase()}${this.colors.reset}`;
    return `[${entry.timestamp}] ${coloredLevel}  [${entry.context.service}:${entry.context.operation}] ${entry.message} | ${this.formatContextData(entry.context)}`;
  }
  formatContextData(context) {
    if (!context.data && !context.error) {
      return "";
    }
    if (context.error) {
      return `error="${context.error.name}: ${context.error.message}" ${context.error.stack ? `
 ${context.error.stack}` : ""}`;
    }
    if (context.data) {
      return Object.entries(context.data).map(([key, value]) => `${key}=${this.formatValue(value)}`).join(" ");
    }
    return "";
  }
  formatValue(value) {
    if (typeof value === "string") return `"${value}"`;
    if (Array.isArray(value)) return `[${value.map((v) => this.formatValue(v))}]`;
    if (value instanceof RegExp) return value.toString();
    if (typeof value === "object" && value !== null) {
      return `{${Object.entries(value).map(([k, v]) => `${k}:${this.formatValue(v)}`).join(",")}}`;
    }
    return String(value);
  }
};

// src/lib/logger.ts
var Logger = class {
  transports;
  defaultContext;
  minLevel;
  /**
   * Constructs a new Logger with the given configuration.
   * @param config The configuration options for this logger.
   * The following options are available:
   * - `transports`: An array of {@link ILogTransport} objects to use for writing log entries.
   * - `defaultContext`: An object of default context to include with every log entry.
   * - `minLevel`: The minimum log level to allow writing to the log. Defaults to `LogLevel.INFO`.
   */
  constructor(config) {
    this.transports = config.transports;
    this.defaultContext = config.defaultContext || {};
    this.minLevel = config.minLevel || "info" /* INFO */;
  }
  /**
   * Logs an error message and optional context with the error log level.
   * @param message The error message to log.
   * @param context Optional context to include in the log entry.
   */
  error(message, context) {
    if (this.shouldLog("error" /* ERROR */)) {
      const entry = this.createLogEntry("error" /* ERROR */, message, context);
      this.transports.forEach((t) => t.log(entry));
    }
  }
  /**
   * Logs a warning message and optional context with the warn log level.
   * @param message The warning message to log.
   * @param context Optional context to include in the log entry.
   */
  warn(message, context) {
    if (this.shouldLog("warn" /* WARN */)) {
      const entry = this.createLogEntry("warn" /* WARN */, message, context);
      this.transports.forEach((t) => t.log(entry));
    }
  }
  /**
   * Logs an info message and optional context with the info log level.
   * @param message The info message to log.
   * @param context Optional context to include in the log entry.
   */
  info(message, context) {
    if (this.shouldLog("info" /* INFO */)) {
      const entry = this.createLogEntry("info" /* INFO */, message, context);
      this.transports.forEach((t) => t.log(entry));
    }
  }
  /**
   * Logs a debug message and optional context with the debug log level.
   * @param message The debug message to log.
   * @param context Optional context to include in the log entry.
   */
  debug(message, context) {
    if (this.shouldLog("debug" /* DEBUG */)) {
      const entry = this.createLogEntry("debug" /* DEBUG */, message, context);
      this.transports.forEach((t) => t.log(entry));
    }
  }
  shouldLog(level) {
    const levels = ["debug" /* DEBUG */, "info" /* INFO */, "warn" /* WARN */, "error" /* ERROR */];
    return levels.indexOf(level) >= levels.indexOf(this.minLevel);
  }
  formatDate(date) {
    const pad = (n) => n.toString().padStart(2, "0");
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
      service: context?.service || this.defaultContext.service || "unknown-service",
      operation: context?.operation || this.defaultContext.operation || "unknown-operation"
    };
    return {
      timestamp: this.formatDate(/* @__PURE__ */ new Date()),
      level,
      message,
      context: mergedContext
    };
  }
};

// src/lib/transport/console-transport.ts
var ConsoleTransport = class {
  formatter;
  constructor(formatter) {
    this.formatter = formatter;
  }
  log(entry) {
    let formattedLog;
    try {
      formattedLog = this.formatter.format(entry);
    } catch (error) {
      console.error("failed to format log entry: ", error);
      console.log(entry);
      return;
    }
    switch (entry.level) {
      case "error" /* ERROR */:
        console.error(formattedLog);
        break;
      case "warn" /* WARN */:
        console.warn(formattedLog);
        break;
      case "info" /* INFO */:
        console.info(formattedLog);
        break;
      case "debug" /* DEBUG */:
        console.debug(formattedLog);
        break;
      default:
        console.log(formattedLog);
        break;
    }
  }
};

// src/lib/logger-factory.ts
var LoggerFactory = class {
  static loggers = /* @__PURE__ */ new Map();
  static defaultConfig;
  static initialized = false;
  static configs;
  /**
   * Initialize the logger factory with the given config.
   * This method should be called once before any loggers are created.
   * @param configs - A mapping of service names to their respective logger configurations.
   */
  static initialize(configs) {
    this.defaultConfig = {
      transports: [new ConsoleTransport(new PrettyFormatter())],
      minLevel: "info" /* INFO */
    };
    this.configs = configs;
    this.initialized = true;
  }
  /**
   * Retrieve a logger instance for the given service name.
   * If the logger has already been created, the cached instance is returned.
   * Otherwise, a new logger is created based on the default config and any
   * service-specific config provided during initialization.
   * @param serviceName - The name of the service to log for.
   * @returns A Logger instance for the given service name.
   */
  static get(serviceName) {
    if (!this.initialized) {
      throw new Error("LoggerFactory must be initialized before use.");
    }
    const formattedServiceName = this.formatServiceName(serviceName);
    if (this.loggers.has(formattedServiceName)) {
      return this.loggers.get(formattedServiceName);
    }
    if (!this.defaultConfig) {
      throw new Error("Default config not initialized");
    }
    const config = {
      ...this.defaultConfig,
      ...this.configs?.[formattedServiceName],
      transports: [
        ...this.defaultConfig.transports,
        ...this.configs?.[formattedServiceName]?.transports || []
      ],
      defaultContext: {
        ...this.defaultConfig.defaultContext,
        ...this.configs?.[formattedServiceName]?.defaultContext,
        service: formattedServiceName
      }
    };
    const logger = new Logger(config);
    this.loggers.set(formattedServiceName, logger);
    return logger;
  }
  static formatServiceName(name) {
    return name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  }
};

// src/lib/formatters/json-formatter.ts
var JsonFormatter = class {
  defaultReplacer(_key, value) {
    if (value instanceof RegExp) {
      return value.toString();
    }
    if (value instanceof Error) {
      return {
        message: value.message,
        name: value.name,
        stack: value.stack
      };
    }
    return value;
  }
  /**
   * Format a log entry into a JSON string.
   *
   * @param entry the log entry to format
   * @param prettyPrint whether to pretty-print the JSON string
   * @param replacer a replacer function to use when stringifying the object
   * @returns a JSON string representation of the log entry
   */
  format(entry, prettyPrint = false, replacer) {
    const finalReplacer = replacer || this.defaultReplacer.bind(this);
    return JSON.stringify(entry, finalReplacer, prettyPrint ? 2 : void 0);
  }
};

// src/lib/transport/sentry-transport.ts
var Sentry = __toESM(require("@sentry/node"), 1);
var SentryTransport = class {
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
    } else {
      Sentry.captureMessage(message, {
        level,
        extra: context.data,
        tags: {
          service: context.service,
          operation: context.operation
        }
      });
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ConsoleTransport,
  JsonFormatter,
  LogLevel,
  Logger,
  LoggerFactory,
  PrettyFormatter,
  SentryTransport
});
