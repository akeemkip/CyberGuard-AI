type LogLevel = 'error' | 'warn' | 'info' | 'debug';

class Logger {
  private isDevelopment = process.env.NODE_ENV !== 'production';

  private log(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    if (this.isDevelopment) {
      // Development: log everything to console
      if (data !== undefined) {
        console[level](logMessage, data);
      } else {
        console[level](logMessage);
      }
    } else {
      // Production: only log errors and warnings
      if (level === 'error' || level === 'warn') {
        if (data !== undefined) {
          console[level](logMessage, data);
        } else {
          console[level](logMessage);
        }
        // TODO: Send to external logging service (Sentry, LogRocket, CloudWatch, etc.)
        // Example: sendToExternalLogger(level, message, data);
      }
    }
  }

  error(message: string, error?: any) {
    this.log('error', message, error);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }
}

export const logger = new Logger();
