import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { Toaster } from "@/shared/components/ui/sonner";
import App from "./App";
import '@/shared/styles/global.css'
import { LanguageProvider } from "@/shared/hooks/useLanguageContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider> 
    <HashRouter>
      <App />
      <Toaster position="top-center" />

    </HashRouter>
    </LanguageProvider> 
  </StrictMode>
);