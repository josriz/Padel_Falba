// src/components/DashboardAdmin.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function DashboardAdmin({ user }) {
  const [courts, setCourts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Verifica se l'utente è admin
  useEffect(() => {
    if (user?.role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  // Fetch dati
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: courtsData, error: courtsError } = await supabase
          .from("courts")
          .select("*");
        if (courtsError) throw courtsError;
        setCourts(courtsData || []);

        const { data: bookingsData, error: bookingsError } = await supabase
          .from("bookings")
          .select("*");
        if (bookingsError) throw bookingsError;
        setBookings(bookingsData || []);
      } catch (err) {
        console.error("Errore fetching dati:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Elimina prenotazione
  const handleDeleteBooking = async (id) => {
    const confirmDelete = window.confirm("Sei sicuro di voler eliminare questa prenotazione?");
    if (!confirmDelete) return;

    try {
      const { error } = await supabase.from("bookings").delete().eq("id", id);
      if (error) throw error;
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Errore eliminazione prenotazione:", err);
    }
  };

  if (!isAdmin) return <p>Accesso negato: non sei amministratore.</p>;
  if (loading) return <p>Caricamento dati amministratore...</p>;

  return (
    <div>
      <h2>Dashboard Amministratore</h2>

      <h3>Campi</h3>
      <ul>
        {courts.map((court) => (
          <li key={court.id}>
            {court.name} - {court.location || "Nessuna posizione"}
          </li>
        ))}
      </ul>

      <h3>Prenotazioni</h3>
      <ul>
        {bookings.map((booking) => (
          <li key={booking.id}>
            Campo {booking.court_id} | Utente: {booking.user_email || booking.user_id} |{" "}
            {new Date(booking.start_time).toLocaleString()} -{" "}
            {new Date(booking.end_time).toLocaleString()}{" "}
            <button onClick={() => handleDeleteBooking(booking.id)} style={{ marginLeft: "10px" }}>
              Elimina
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
