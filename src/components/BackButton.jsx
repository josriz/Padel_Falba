import React from "react";
import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      style={{
        padding: "8px 12px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        backgroundColor: "#f0f0f0",
        cursor: "pointer",
        marginBottom: "16px",
      }}
      aria-label="Torna indietro"
    >
      ← Indietro
    </button>
  );
}
