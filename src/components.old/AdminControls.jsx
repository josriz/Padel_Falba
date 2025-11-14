// AdminControls.jsx
import React, { useState } from "react";

export default function AdminControls({ onManageUsers, onManageCourts, onManageTournaments }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "20px auto",
        padding: 20,
        border: "2px solid #ffc107",
        borderRadius: 12,
        backgroundColor: "#fff3cd",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h1 style={{ color: "#856404", textAlign: "center", marginBottom: 20 }}>
        Pannello Amministratore ⚙️
      </h1>

      <p style={{ textAlign: "center" }}>
        Questa sezione è accessibile solo agli utenti con permessi amministrativi.
      </p>

      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 20, flexWrap: "wrap" }}>
        <button
          onClick={onManageCourts}
          style={{
            padding: "12px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: "600",
            cursor: "pointer",
            minWidth: 150,
          }}
        >
          Gestione Campi
        </button>

        <button
          onClick={onManageUsers}
          style={{
            padding: "12px 20px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: "600",
            cursor: "pointer",
            minWidth: 150,
          }}
        >
          Gestione Utenti
        </button>

        <button
          onClick={onManageTournaments}
          style={{
            padding: "12px 20px",
            backgroundColor: "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: "600",
            cursor: "pointer",
            minWidth: 150,
          }}
        >
          Configurazione Tornei
        </button>
      </div>

      <p style={{ marginTop: 25, fontStyle: "italic", color: "#666", textAlign: "center" }}>
        Qui puoi implementare, modificare o visualizzare dati sensibili. Seleziona una funzione sopra per iniziare.
      </p>
    </div>
  );
}
