import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Menu, X } from "lucide-react";
import DashboardUser from "./DashboardUser";
import AdminDashboard from "./dashboardAdmin";

export default function DashboardWrapper({ user, setUser, isAdmin, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("DashboardWrapper isAdmin:", isAdmin);
  }, [isAdmin]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/");
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#f5f5f5" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "15px 25px",
          background: "#007bff",
          color: "white",
        }}
      >
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "white" }}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {menuOpen && (
        <>
          <div
            onClick={() => setMenuOpen(false)}
            style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.3)" }}
            aria-hidden="true"
          />
          <nav
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              width: "250px",
              height: "100%",
              background: "#fff",
              boxShadow: "-3px 0 10px rgba(0,0,0,0.1)",
              padding: "20px",
              zIndex: 1000,
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
            aria-label="Main menu"
          >
            <h3 style={{ color: "#007bff", marginBottom: "20px" }}>Menu</h3>
            <button onClick={() => { navigate("/prenotazioni"); setMenuOpen(false); }} aria-label="Prenota i Campi">
              Prenota i Campi
            </button>
            <button onClick={() => { navigate("/eventi"); setMenuOpen(false); }} aria-label="Eventi e Tornei">
              Eventi & Tornei
            </button>
            <button onClick={() => { navigate("/marketplace"); setMenuOpen(false); }} aria-label="Marketplace">
              Marketplace
            </button>
            <button onClick={() => { navigate("/profilo"); setMenuOpen(false); }} aria-label="Profilo">
              Profilo
            </button>
            <button onClick={handleLogout} style={{ color: "red", marginTop: "auto" }} aria-label="Logout">
              Logout
            </button>
          </nav>
        </>
      )}

      <main style={{ padding: "30px" }}>
        {isAdmin ? (
          <>
            {editing ? (
              <AdminDashboard />
            ) : (
              <DashboardUser user={user} isAdmin={isAdmin} onLogout={onLogout} />
            )}
            <button
              onClick={() => setEditing(!editing)}
              style={{
                marginTop: 20,
                padding: "10px 20px",
                backgroundColor: editing ? "#4caf50" : "#2196f3",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              {editing ? "Disabilita modifica" : "Abilita modifica"}
            </button>
          </>
        ) : (
          <DashboardUser user={user} isAdmin={isAdmin} onLogout={onLogout} />
        )}
      </main>
    </div>
  );
}
