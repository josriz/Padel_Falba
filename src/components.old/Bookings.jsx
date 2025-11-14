// Bookings.jsx
import React, { useState, useEffect } from "react";
import BackButton from "./BackButton";
import { supabase } from "../supabaseClient";

export default function Bookings({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("id, court_id, start_time, end_time, status")
        .eq("user_id", user.id)
        .order("start_time", { ascending: true });

      if (error) throw error;
      setBookings(data);
    } catch (e) {
      console.error("Errore fetch prenotazioni:", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "20px auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <BackButton />
      <h2 style={{ color: "#007bff", marginBottom: 20 }}>Le mie Prenotazioni</h2>

      {loading ? (
        <p>Caricamento prenotazioni...</p>
      ) : bookings.length === 0 ? (
        <p>Nessuna prenotazione disponibile</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {bookings.map((b) => (
            <li
              key={b.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 12,
                marginBottom: 10,
                background: "#f9f9f9",
              }}
            >
              <p><strong>Campo:</strong> {b.court_id}</p>
              <p><strong>Orario:</strong> {new Date(b.start_time).toLocaleString()} - {new Date(b.end_time).toLocaleTimeString()}</p>
              <p><strong>Status:</strong> {b.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
