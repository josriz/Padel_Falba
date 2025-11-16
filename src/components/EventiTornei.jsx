import React, { useState, useEffect } from "react";
import { supabase } from '../supabaseClient';
import TournamentDashboard from "./TournamentDashboard";

export default function EventiTornei({ isAdmin }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data, error } = await supabase
          .from("tournament_events")
          .select("*")
          .order("date", { ascending: true });

        if (error) throw error;

        setEvents(data || []);
        if (data && data.length > 0) setSelectedEventId(data[0].id);
      } catch (err) {
        setError(err.message || "Errore sconosciuto");
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  if (loading) return <div>Caricamento eventi...</div>;
  if (error) return <div className="text-red-600">Errore: {error}</div>;
  if (events.length === 0) return <div>Nessun evento disponibile.</div>;

  return (
    <div>
      <h2>Seleziona Torneo:</h2>
      <select
        onChange={e => setSelectedEventId(e.target.value)}
        value={selectedEventId || ""}
        className="mb-4 p-2 border rounded"
      >
        {events.map(event => (
          <option key={event.id} value={event.id}>
            {event.name} - {new Date(event.date).toLocaleDateString()}
          </option>
        ))}
      </select>

      {selectedEventId && (
        <TournamentDashboard isAdmin={isAdmin} torneoId={selectedEventId} />
      )}
    </div>
  );
}
