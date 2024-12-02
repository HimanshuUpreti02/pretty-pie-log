declare module "PieLogger" {
  export interface PieLoggerOptions {
    loggerName: string;
    timezone?: string;
    timestampPadding?: number;
    logLevelPadding?: number;
    filePathPadding?: number;
    colorful?: boolean;
    minimumLogLevel?: number;
    logToFile?: boolean;
    logDirectory?: string;
    logFileSizeLimit?: number;
    maxBackupFiles?: number;
  }

  export enum PieLogLevel {
    DEBUG = 10,
    INFO = 20,
    WARNING = 30,
    ERROR = 40,
    CRITICAL = 50,
  }

  export class PieLogger {
    constructor(options: PieLoggerOptions);

    debug(message: string, details?: Record<string, any>): void;
    info(message: string, details?: Record<string, any>): void;
    warning(message: string, details?: Record<string, any>): void;
    error(message: string, details?: Record<string, any>): void;
    critical(message: string, details?: Record<string, any>): void;
  }
}
