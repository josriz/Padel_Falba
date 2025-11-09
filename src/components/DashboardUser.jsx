import React from "react";

export default function DashboardUser({ user, isAdmin, onLogout }) {
  return (
    <div
      style={{
        maxWidth: 800,
        margin: "40px auto",
        fontFamily: "Arial, sans-serif",
        padding: "0 16px",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: 16 }}>
        Benvenuto, {user.email}
      </h1>
      <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: 24 }}>
        Questa è la tua dashboard di vetrina.
      </p>
      {isAdmin && (
        <p
          style={{
            fontWeight: "bold",
            color: "green",
            fontSize: "1rem",
            marginBottom: 24,
          }}
        >
          Puoi variare e modificare i dati come amministratore.
        </p>
      )}
      <div style={{ textAlign: "right" }}>
        <button
          onClick={onLogout}
          style={{
            backgroundColor: "#f44336",
            color: "#fff",
            border: "none",
            padding: "12px 20px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1rem",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#d32f2f")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#f44336")}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
