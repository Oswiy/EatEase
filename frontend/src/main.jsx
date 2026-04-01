import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ToastProvider } from "./context/ToastContext"; // ✅ Add this import
import "./globals.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastProvider>
      {" "}
      {/* ✅ Wrap App with ToastProvider */}
      <App />
    </ToastProvider>
  </React.StrictMode>,
);
