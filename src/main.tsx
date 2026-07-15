import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { Toaster } from "@/shared/components/ui/sonner";
import App from "./App";
import '@/shared/styles/global.css'
import { LanguageProvider } from "@/shared/hooks/useLanguageContext";
import { ThemeProvider } from '@/shared/context/ThemeContext';


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
    <LanguageProvider> 
    <HashRouter>
      <App />
      <Toaster position="top-center" />

    </HashRouter>
    </LanguageProvider> 
    </ThemeProvider>
  </StrictMode>
);