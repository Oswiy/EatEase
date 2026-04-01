import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./globals.css";
import { ToastProvider } from "./context/ToastContext.jsx"; // ✅ Add this import

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastProvider>
      {" "}
      {/* ✅ Wrap App with ToastProvider */}
      <App />
    </ToastProvider>
  </React.StrictMode>,
);
