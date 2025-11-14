import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    // Recupera token dalla URL (supabase lo aggiunge come query param: ?access_token=xxx)
    const params = new URLSearchParams(window.location.search);
    const token = params.get("access_token");
    if (token) setAccessToken(token);
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!password) {
      setMessage("⚠️ Inserisci una nuova password");
      return;
    }
    if (!accessToken) {
      setMessage("❌ Token non valido o mancante");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password,
    }, accessToken);
    setLoading(false);

    if (error) {
      setMessage("❌ Errore: " + error.message);
    } else {
      setMessage("✅ Password aggiornata con successo! Puoi ora tornare al login.");
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "50px auto",
        padding: 20,
        border: "1px solid #ddd",
        borderRadius: 8,
        textAlign: "center",
        fontFamily: "sans-serif",
      }}
    >
      <h2>Reset Password</h2>
      <p>Inserisci la nuova password per il tuo account</p>
      <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <input
          type="password"
          placeholder="Nuova password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          style={{ padding: 10, fontSize: "1rem", borderRadius: 5, border: "1px solid #ccc" }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 12,
            borderRadius: 5,
            border: "none",
            backgroundColor: "#2980b9",
            color: "#fff",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Aggiornamento..." : "Aggiorna Password"}
        </button>
      </form>
      {message && (
        <p style={{ marginTop: 15, color: message.startsWith("✅") ? "green" : "red" }}>
          {message}
        </p>
      )}
    </div>
  );
}
