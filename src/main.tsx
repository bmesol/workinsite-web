import { createRoot } from "react-dom/client";
import "@/shared/styles/global.css";
import { StrictMode } from "react";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
