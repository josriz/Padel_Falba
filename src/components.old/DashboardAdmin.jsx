// Dashboard.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import MenuSidebar from "./MenuSidebar";
import BackButton from "./BackButton";

export default function Dashboard({ user }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Verifica se l'utente è admin
  useEffect(() => {
    const checkAdmin = async () => {
      const { data, error } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
      if (!error && data?.is_admin) setIsAdmin(true);
    };
    checkAdmin();
  }, [user]);

  return (
    <div style={{ maxWidth: 900, margin: "20px auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      {/* Hamburger menu */}
      <button
        onClick={() => setMenuOpen(true)}
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          padding: "10px 12px",
          borderRadius: 6,
          backgroundColor: "#3b82f6",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          zIndex: 1200,
        }}
      >
        ☰
      </button>

      {/* Sidebar */}
      <MenuSidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Saluto e info */}
      <h2>Benvenuto, {user.email}</h2>

      {/* Bottone Admin solo per admin */}
      {isAdmin && (
        <button
          style={{
            padding: "10px 16px",
            backgroundColor: "#f59e0b",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            marginBottom: 20,
            cursor: "pointer",
          }}
          onClick={() => alert("Apri pannello Admin per gestione")}
        >
          Pannello Admin ⚙️
        </button>
      )}

      {/* Vetrina utente */}
      <div style={{ padding: 20, border: "2px solid #ccc", borderRadius: 8, marginBottom: 20 }}>
        <h3>Vetrina servizi</h3>
        <ul>
          <li>Servizio 1</li>
          <li>Servizio 2</li>
          <li>Servizio 3</li>
        </ul>
      </div>

      {/* Bottone indietro */}
      <BackButton />
    </div>
  );
}
