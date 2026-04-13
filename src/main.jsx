import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { routes } from "./routes";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";    
import ToastProvider from "./components/ToastProvider";

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>                   
      <LanguageProvider>
        <ToastProvider />
        <RouterProvider router={router} />
      </LanguageProvider>
    </AuthProvider>
  </StrictMode>
);