// src/main.jsx - ✅ RIPRISTINATO ORIGINALE (come funzionava prima!)
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
// ❌ RIMUOVI: import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* ✅ SOLO App - come prima! */}
    <App />
  </React.StrictMode>
);
