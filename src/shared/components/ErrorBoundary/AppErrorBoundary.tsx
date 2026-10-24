import * as Sentry from "@sentry/react";
import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function AppErrorBoundary({ children }: Props) {
  return (
    <Sentry.ErrorBoundary
      fallback={
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h2>Something went wrong.</h2>
          <p>The error has been reported. Please refresh the page.</p>
        </div>
      }
      showDialog={false}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}
