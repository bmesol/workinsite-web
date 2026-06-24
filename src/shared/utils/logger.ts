const isDev = import.meta.env.DEV; // Vite; use process.env.NODE_ENV === 'development' for CRA/Next.js

const logger = {
  info: (message: string, ...args: unknown[]): void => {
    if (isDev) {
      console.log(`[INFO] ${message}`, ...args);
      return;
    }
    try {
      // TODO: replace with your web monitoring tool (e.g. Sentry, Datadog)
      // Sentry example: Sentry.addBreadcrumb({ message: `[INFO] ${message}`, level: 'info' });
    } catch {}
  },

  warn: (message: string, ...args: unknown[]): void => {
    if (isDev) {
      console.warn(`[WARN] ${message}`, ...args);
      return;
    }
    try {
      // Sentry example: Sentry.addBreadcrumb({ message: `[WARN] ${message}`, level: 'warning' });
    } catch {}
  },

  error: (message: string, error?: unknown, ...args: unknown[]): void => {
    if (isDev) {
      console.error(`[ERROR] ${message}`, error, ...args);
      return;
    }
    try {
      // Sentry example:
      // Sentry.addBreadcrumb({ message: `[ERROR] ${message}`, level: 'error' });
      // if (error instanceof Error) {
      //   Sentry.captureException(error);
      // } else {
      //   Sentry.captureException(
      //     new Error(`${message}: ${JSON.stringify(error ?? 'unknown')}`)
      //   );
      // }
    } catch {}
  },
};

export default logger;