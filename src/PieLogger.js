import fs from "fs";
import path from "path";
import os from "os";
import util from "util";
import chalk from "chalk";

export class PieLogLevel {
  // Log levels to categorize messages by severity
  static DEBUG = 10; // Used for detailed debugging information
  static INFO = 20; // General information about application operations
  static WARNING = 30; // Warnings that may not require immediate attention
  static ERROR = 40; // Errors indicating a problem that needs fixing
  static CRITICAL = 50; // Severe issues that may cause the application to crash

  /**
   * Retrieves the string representation of a log level.
   * @param {number} level - The numeric log level.
   * @returns {string} - The string representation of the log level (e.g., "DEBUG", "INFO").
   */
  static getLevelStr(level) {
    switch (level) {
      case PieLogLevel.DEBUG:
        return "DEBUG";
      case PieLogLevel.INFO:
        return "INFO";
      case PieLogLevel.WARNING:
        return "WARNING";
      case PieLogLevel.ERROR:
        return "ERROR";
      case PieLogLevel.CRITICAL:
        return "CRITICAL";
      default:
        return "UNKNOWN"; // Default to "UNKNOWN" for unsupported levels
    }
  }
}

export class PieLogger {
  /**
   * Creates an instance of PieLogger.
   * @param {object} options - Configuration options for the logger.
   * @param {string} options.loggerName - The name of the logger, used to identify log messages.
   * @param {string} [options.timezone="UTC"] - The timezone for timestamps.
   * @param {number} [options.timestampPadding=30] - Padding for the timestamp column.
   * @param {number} [options.logLevelPadding=10] - Padding for the log level column.
   * @param {number} [options.filePathPadding=30] - Padding for the logger name column.
   * @param {boolean} [options.colorful=true] - Whether log messages should be colorized.
   * @param {number} [options.minimumLogLevel=PieLogLevel.INFO] - The minimum log level to log.
   * @param {boolean} [options.logToFile=true] - Whether logs should be written to a file.
   * @param {string} [options.logDirectory="logs"] - Directory for log files.
   * @param {number} [options.logFileSizeLimit=32*1024*1024] - Maximum log file size in bytes.
   * @param {number} [options.maxBackupFiles=2] - Number of backup log files to maintain.
   */
  constructor({
    loggerName,
    timezone = "UTC",
    timestampPadding = 30,
    logLevelPadding = 10,
    filePathPadding = 30,
    colorful = true,
    minimumLogLevel = PieLogLevel.INFO,
    logToFile = true,
    logDirectory = "logs",
    logFileSizeLimit = 32 * 1024 * 1024,
    maxBackupFiles = 2,
  } = {}) {
    this.loggerName = loggerName;
    this.timezone = timezone;
    this.timestampPadding = timestampPadding;
    this.logLevelPadding = logLevelPadding;
    this.filePathPadding = filePathPadding;
    this.colorful = colorful;
    this.minimumLogLevel = minimumLogLevel;
    this.logToFile = logToFile;
    this.logDirectory = logDirectory;
    this.logFileSizeLimit = logFileSizeLimit;
    this.maxBackupFiles = maxBackupFiles;
    this.startTimestamp = new Date().toISOString().replace(/:/g, "-");

    if (logToFile) {
      this.setupLogDirectory(); // Initialize log directory if logging to file
    }
  }

  /**
   * Sets up the directory and file for log storage.
   * Creates a timestamped directory inside the user's home directory.
   */
  setupLogDirectory() {
    const logDir = path.join(
      os.homedir(),
      this.logDirectory,
      this.startTimestamp
    );
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true }); // Ensure parent directories are created
    }
    this.logFilePath = path.join(
      logDir,
      `${this.loggerName}-${this.startTimestamp}.log`
    );
    this.fileWriteStream = fs.createWriteStream(this.logFilePath, {
      flags: "a", // Append mode
    });
  }

  /**
   * Retrieves the current timestamp in ISO format.
   * @returns {string} - The current timestamp (YYYY-MM-DD HH:mm:ss).
   */
  getTimestamp() {
    const date = new Date();
    return date.toISOString().replace("T", " ").slice(0, -1);
  }

  /**
   * Logs a message with a specified level.
   * @param {number} level - Log level for the message (DEBUG, INFO, etc.).
   * @param {string} message - The message to log.
   * @param {object|null} [details=null] - Optional additional details to log.
   * @param {boolean} [execInfo=false] - Whether to include execution info (not implemented here).
   */
  log(level, message, details = null, execInfo = false) {
    if (level < this.minimumLogLevel) return;

    const levelStr = PieLogLevel.getLevelStr(level).padEnd(
      this.logLevelPadding
    );
    const timestamp = this.getTimestamp().padEnd(this.timestampPadding);
    const filePath = `[${this.loggerName}]`.padEnd(this.filePathPadding);

    const logMessage = `${timestamp} ${levelStr} ${filePath}: ${message}`;
    const fullLog = details
      ? `${logMessage}\n${util.inspect(details, { depth: null })}`
      : logMessage;

    this.consoleLog(level, fullLog); // Log to console
    if (this.logToFile) this.fileLog(fullLog); // Log to file
  }

  /**
   * Logs a message to the console with optional colorization.
   * @param {number} level - Log level of the message.
   * @param {string} logMessage - The message to log.
   */
  consoleLog(level, logMessage) {
    const colorMapping = {
      [PieLogLevel.DEBUG]: chalk.cyan,
      [PieLogLevel.INFO]: chalk.green,
      [PieLogLevel.WARNING]: chalk.yellow,
      [PieLogLevel.ERROR]: chalk.red,
      [PieLogLevel.CRITICAL]: chalk.magenta,
    };

    const colorize = this.colorful
      ? colorMapping[level] || chalk.white
      : (str) => str; // Apply color if enabled
    console.log(colorize(logMessage)); // Log to console with color
  }

  /**
   * Writes a log message to the log file.
   * @param {string} logMessage - The message to write.
   */
  fileLog(logMessage) {
    if (this.fileWriteStream) {
      this.fileWriteStream.write(`${logMessage}\n`); // Append log message to file
    }
  }

  // Wrapper methods for convenience
  debug(message, details = null) {
    this.log(PieLogLevel.DEBUG, message, details);
  }

  info(message, details = null) {
    this.log(PieLogLevel.INFO, message, details);
  }

  warning(message, details = null) {
    this.log(PieLogLevel.WARNING, message, details);
  }

  error(message, details = null) {
    this.log(PieLogLevel.ERROR, message, details);
  }

  critical(message, details = null) {
    this.log(PieLogLevel.CRITICAL, message, details);
  }
}
