import * as Sentry from "@sentry/react";

const isDev = import.meta.env.DEV;

const logger = {
  info: (message: string, ...args: unknown[]): void => {
    if (isDev) {
      console.log(`[INFO] ${message}`, ...args);
      return;
    }
    try {
      Sentry.addBreadcrumb({ message, level: "info", data: { args } });
    } catch {}
  },

  warn: (message: string, ...args: unknown[]): void => {
    if (isDev) {
      console.warn(`[WARN] ${message}`, ...args);
      return;
    }
    try {
      Sentry.addBreadcrumb({ message, level: "warning", data: { args } });
    } catch {}
  },

  error: (message: string, error?: unknown, ...args: unknown[]): void => {
    if (isDev) {
      console.error(`[ERROR] ${message}`, error, ...args);
      return;
    }
    try {
      Sentry.addBreadcrumb({ message, level: "error" });
      if (error instanceof Error) {
        Sentry.captureException(error);
      } else {
        Sentry.captureException(
          new Error(`${message}: ${JSON.stringify(error ?? "unknown")}`),
        );
      }
    } catch {}
  },
};

export default logger;
