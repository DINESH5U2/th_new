import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "@fontsource-variable/instrument-sans/wght.css";
import "@fontsource-variable/instrument-sans/wght-italic.css";
import App from "./App";
import { initAnalytics } from "./utils/analytics";

initAnalytics();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);
