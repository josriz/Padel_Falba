import React, { useState } from "react";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Gestione Eventi & Tornei</h2>
      <p>Qui potrai aggiungere, modificare o cancellare eventi.</p>

      {events.length === 0 ? (
        <p>Nessun evento ancora.</p>
      ) : (
        events.map((e, i) => <div key={i}>{e.name}</div>)
      )}

      <button style={{ marginTop: "20px" }}>➕ Aggiungi Evento</button>
    </div>
  );
}
