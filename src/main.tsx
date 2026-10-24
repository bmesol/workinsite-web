import "./instrument";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { Toaster } from "@/shared/components/ui/sonner";
import App from "./App";
import '@/shared/styles/global.css'
import { LanguageProvider } from "@/shared/hooks/useLanguageContext";
import { ThemeProvider } from '@/shared/context/ThemeContext';
import { initAnalytics } from '@/shared/utils/analytics';
import { reactErrorHandler } from "@sentry/react";
import { AppErrorBoundary } from "@/shared/components/ErrorBoundary/AppErrorBoundary";

initAnalytics();

createRoot(document.getElementById("root")!, {
  onUncaughtError: reactErrorHandler(),
  onCaughtError: reactErrorHandler(),
  onRecoverableError: reactErrorHandler(),
}).render(
  <StrictMode>
    <AppErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <HashRouter>
            <App />
            <Toaster position="top-center" />
          </HashRouter>
        </LanguageProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  </StrictMode>
);