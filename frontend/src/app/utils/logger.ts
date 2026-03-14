/**
 * Development-only logger. All calls are no-ops in production builds.
 * Vite tree-shakes the console calls away when import.meta.env.DEV is false.
 */
export const devLog = (...args: unknown[]) => {
  if (import.meta.env.DEV) {
    console.log(...args);
  }
};

export const devWarn = (...args: unknown[]) => {
  if (import.meta.env.DEV) {
    console.warn(...args);
  }
};
