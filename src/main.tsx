import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { Toaster } from "@/shared/components/ui/sonner";
import App from "./App";
import '@/shared/styles/global.css'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <App />
      <Toaster /> 
    </HashRouter>
  </StrictMode>
);