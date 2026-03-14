import fs from 'fs';
import path from 'path';

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

const LOG_DIR = path.resolve(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_DIR, 'app.log');
const MAX_LOG_SIZE = 10 * 1024 * 1024; // 10MB before rotation

class Logger {
  private isDevelopment = process.env.NODE_ENV !== 'production';
  private isTest = process.env.NODE_ENV === 'test';
  private fileReady = false;

  constructor() {
    if (!this.isDevelopment && !this.isTest) {
      try {
        if (!fs.existsSync(LOG_DIR)) {
          fs.mkdirSync(LOG_DIR, { recursive: true });
        }
        this.fileReady = true;
      } catch {
        console.error(`[Logger] Failed to create log directory: ${LOG_DIR}`);
      }
    }
  }

  private rotateIfNeeded() {
    try {
      const stats = fs.statSync(LOG_FILE);
      if (stats.size >= MAX_LOG_SIZE) {
        const rotated = `${LOG_FILE}.${Date.now()}.old`;
        fs.renameSync(LOG_FILE, rotated);
      }
    } catch {
      // File doesn't exist yet, no rotation needed
    }
  }

  private writeToFile(entry: object) {
    if (!this.fileReady) return;
    try {
      this.rotateIfNeeded();
      fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + '\n');
    } catch {
      // Silently fail — logging should never crash the app
    }
  }

  private log(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    if (this.isTest) {
      // Test: suppress all logs unless explicitly debugging
      return;
    }

    if (this.isDevelopment) {
      // Development: log everything to console
      if (data !== undefined) {
        console[level](logMessage, data);
      } else {
        console[level](logMessage);
      }
    } else {
      // Production: console + file for errors and warnings, console for info
      if (level === 'error' || level === 'warn') {
        if (data !== undefined) {
          console[level](logMessage, data);
        } else {
          console[level](logMessage);
        }

        const entry: Record<string, unknown> = { timestamp, level, message };
        if (data !== undefined) {
          entry.data = data instanceof Error
            ? { name: data.name, message: data.message, stack: data.stack }
            : data;
        }
        this.writeToFile(entry);
      } else if (level === 'info') {
        if (data !== undefined) {
          console[level](logMessage, data);
        } else {
          console[level](logMessage);
        }
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
