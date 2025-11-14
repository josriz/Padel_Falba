import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function EventiAdmin() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    const { data } = await supabase.from("eventi").select("*").order("date", { ascending: true });
    setEvents(data);
  };

  const addEvent = async () => {
    await supabase.from("eventi").insert({ title, date });
    setTitle(""); setDate("");
    fetchEvents();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Gestione Eventi/Tornei</h2>
      <input placeholder="Titolo evento" value={title} onChange={e => setTitle(e.target.value)} />
      <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      <button onClick={addEvent}>Aggiungi Evento</button>
      <ul>
        {events.map(e => (<li key={e.id}>{e.title} - {e.date}</li>))}
      </ul>
    </div>
  );
}
