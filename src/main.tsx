// main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/shared/components/ui/sonner";
import App from "./App";
import '@/shared/styles/global.css'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter> 
      <App />
      <Toaster /> 
    </BrowserRouter>
  </StrictMode>
);

