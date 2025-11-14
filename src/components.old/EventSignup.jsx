// EventSignup.jsx
import React, { useState } from "react";

export default function EventSignup({ registrations, setRegistrations, maxPlayers = 32 }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    accepted: false,
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.first_name || !form.last_name || !form.email || !form.phone) {
      setMessage("⚠️ Compila tutti i campi obbligatori");
      return;
    }

    if (!form.accepted) {
      setMessage("⚠️ Devi confermare la partecipazione al torneo");
      return;
    }

    if (registrations.length >= maxPlayers) {
      setMessage("❌ Iscrizioni chiuse: tutti i posti sono occupati");
      return;
    }

    // Inserimento registrazione
    setRegistrations([...registrations, { ...form }]);
    setMessage("✅ Iscrizione avvenuta con successo!");
    setForm({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      accepted: false,
    });
  };

  return (
    <div style={{ maxWidth: 400, margin: "20px auto", padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Iscrizione Torneo</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          type="text"
          name="first_name"
          placeholder="Nome"
          value={form.first_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Cognome"
          value={form.last_name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Cellulare"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <label style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <input
            type="checkbox"
            name="accepted"
            checked={form.accepted}
            onChange={handleChange}
          />
          Accetto la partecipazione al torneo
        </label>

        <button type="submit" style={{ padding: 10, borderRadius: 5, backgroundColor: "#3b82f6", color: "#fff", border: "none" }}>
          Iscriviti
        </button>
      </form>
      {message && <p style={{ marginTop: 10, color: message.startsWith("✅") ? "green" : "red" }}>{message}</p>}

      <div style={{ marginTop: 20 }}>
        <h3>Iscritti ({registrations.length}/{maxPlayers})</h3>
        <ul>
          {registrations.map((r, i) => (
            <li key={i}>{r.first_name} {r.last_name} ({r.email})</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
