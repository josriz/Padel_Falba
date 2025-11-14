import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function EventiTornei({ user }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Al primo caricamento: verifica se è admin e scarica gli eventi
  useEffect(() => {
    fetchEvents();
    if (user?.email?.endsWith("@admin.com")) setIsAdmin(true);
  }, []);

  // Funzione per prendere gli eventi da Supabase
  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events") // 👈 Tabella Supabase deve chiamarsi "events"
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.error("Errore caricamento eventi:", error);
    } else {
      setEvents(data);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 900, margin: "30px auto", padding: 20 }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>
        🏆 Eventi & Tornei
      </h2>

      {/* Pulsante solo per admin */}
      {isAdmin && (
        <button
          onClick={() => (window.location.href = "/admin-eventi")}
          style={{
            display: "block",
            margin: "0 auto 20px auto",
            padding: "10px 20px",
            border: "none",
            backgroundColor: "#007BFF",
            color: "white",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Gestisci Eventi
        </button>
      )}

      {loading ? (
        <p style={{ textAlign: "center" }}>⏳ Caricamento eventi...</p>
      ) : events.length === 0 ? (
        <p style={{ textAlign: "center" }}>Nessun evento disponibile.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {events.map((event) => (
            <div
              key={event.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: 12,
                padding: 16,
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {event.image_url && (
                <img
                  src={event.image_url}
                  alt={event.title}
                  style={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                    borderRadius: 8,
                    marginBottom: 10,
                  }}
                />
              )}
              <h3 style={{ marginBottom: 8 }}>{event.title}</h3>
              <p style={{ fontSize: 14, color: "#555" }}>{event.description}</p>
              <p style={{ marginTop: 10, fontWeight: "bold", color: "#007BFF" }}>
                📅 {new Date(event.date).toLocaleDateString("it-IT")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
