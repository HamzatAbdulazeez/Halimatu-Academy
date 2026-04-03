import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { routes } from "./routes";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import ToastProvider from "./components/ToastProvider";

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LanguageProvider>
      <ToastProvider />
      <RouterProvider router={router} />
    </LanguageProvider>
  </StrictMode>
);