import React from "react";

export default function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: "#2563eb",
        color: "white",
        padding: "8px 16px",
        border: "none",
        borderRadius: "6px",
        marginBottom: "10px",
        cursor: "pointer",
      }}
    >
      ← Indietro
    </button>
  );
}
