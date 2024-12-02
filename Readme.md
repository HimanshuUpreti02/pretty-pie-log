# **PieLogger**

`PieLogger` is a feature-rich, customizable, and lightweight logger for Node.js applications. It supports multiple log levels, structured logging, colored console output, and file-based logging.

---

## **Installation**

Install the package using npm:

```bash
npm install pie-logger
```

---

## **Usage**

### **1. Basic Setup**

```javascript
import { PieLogger } from "pie-logger";

const logger = new PieLogger({ loggerName: "MyAppLogger" });

logger.info("This is an info message.");
logger.error("This is an error message.", { error: "Sample Error" });
```

---

### **2. Available Log Levels**

| Log Level | Method              | Example                                   |
| --------- | ------------------- | ----------------------------------------- |
| Debug     | `logger.debug()`    | `logger.debug("Debugging the process.");` |
| Info      | `logger.info()`     | `logger.info("Informational message.");`  |
| Warning   | `logger.warning()`  | `logger.warning("This is a warning.");`   |
| Error     | `logger.error()`    | `logger.error("An error occurred.");`     |
| Critical  | `logger.critical()` | `logger.critical("Critical failure!");`   |

Example:

```javascript
logger.debug("Debugging a process.");
logger.info("This is an informational message.");
logger.warning("This is a warning message.");
logger.error("This is an error message.", { errorCode: 500 });
logger.critical("Critical failure!", { service: "Database" });
```

---

### **3. Configuration Options**

You can customize `PieLogger` with several configuration options:

```javascript
const logger = new PieLogger({
  loggerName: "MyAppLogger", // Name of the logger
  logToFile: true, // Enable/Disable file-based logging (default: true)
  logDirectory: "logs", // Directory for log files (default: 'logs')
  minimumLogLevel: PieLogLevel.DEBUG, // Minimum log level (default: INFO)
  colorful: true, // Enable colored console output (default: true)
});
```

---

### **4. Structured Logging**

`PieLogger` supports structured logging with additional details:

```javascript
logger.info("User logged in", { userId: 123, action: "login" });
logger.error("Error processing request", {
  endpoint: "/api/data",
  errorCode: 400,
});
```

---

### **5. File Logging**

Logs are automatically saved to files when `logToFile` is enabled. Files are rotated when they reach the size limit (`32MB` by default).

---

## **License**

This package is open-source and available under the [MIT License](./LICENSE).

---

## **Author**

Developed by **Chanpreet Singh** & **Himanshu Upreti**.

---

### **Contributions**

Feel free to fork, contribute, or submit issues on the [GitHub repository](https://github.com/your-repo-link). 😊

---

This README can be placed in a `README.md` file in your project and will be displayed on your package's npm page. Adjust the GitHub repository link and other details as needed.
