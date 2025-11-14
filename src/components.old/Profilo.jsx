// Profile.jsx
import React from "react";
import BackButton from "./BackButton";

export default function Profile({ user }) {
  return (
    <div style={{ maxWidth: 600, margin: "20px auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <BackButton />

      <h2 style={{ color: "#007bff", marginBottom: 20 }}>Il mio Profilo</h2>

      <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 20, background: "#f9f9f9" }}>
        <p><strong>Nome:</strong> {user?.full_name || "Non disponibile"}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Ruolo:</strong> {user?.is_admin ? "Amministratore" : "Utente"}</p>
      </div>
    </div>
  );
}
