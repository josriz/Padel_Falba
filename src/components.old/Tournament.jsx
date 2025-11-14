import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Tournament({ eventId, user }) {
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [matches, setMatches] = useState([]);
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone: "", accepted: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const { data: eData, error: eError } = await supabase.from("events").select("*").eq("id", eventId).single();
      if (eError) throw eError;
      setEvent(eData);

      const { data: pData, error: pError } = await supabase.from("participants").select("*").eq("event_id", eventId).order("created_at", { ascending: true });
      if (pError) throw pError;
      setParticipants(pData);

      const { data: mData, error: mError } = await supabase.from("tournament_matches").select("*").eq("event_id", eventId).order("round", { ascending: true });
      if (mError) throw mError;
      setMatches(mData || []);
    } catch (e) {
      console.error("Errore fetchData:", e.message);
      setError("Errore caricamento dati: " + e.message);
    }
    setLoading(false);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (!form.first_name || !form.last_name || !form.email || !form.phone || !form.accepted) {
      return setError("Compila tutti i campi e accetta il torneo!");
    }
    if (participants.length >= event.max_players) {
      return setError("Iscrizioni chiuse, posti terminati!");
    }

    const { data, error } = await supabase.from("participants").insert([{
      event_id: eventId,
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone,
      accepted: form.accepted
    }]);
    if (error) return setError(error.message);

    setForm({ first_name: "", last_name: "", email: "", phone: "", accepted: false });
    fetchData();
  }

  async function updateScore(matchId, scoreA, scoreB) {
    const winner = scoreA > scoreB ? "a" : scoreB > scoreA ? "b" : null;
    const match = matches.find(m => m.id === matchId);
    const winnerId = winner === "a" ? match.player_a : winner === "b" ? match.player_b : null;

    const { error } = await supabase.from("tournament_matches").update({
      score_a: scoreA,
      score_b: scoreB,
      winner: winnerId
    }).eq("id", matchId);

    if (error) return console.error("Errore updateScore:", error.message);
    if (winnerId) advanceWinner(match.round, matchId, winnerId);
    fetchData();
  }

  async function advanceWinner(round, matchId, winnerId) {
    const nextRound = round + 1;
    const targetIndex = Math.floor(matchId / 2);

    let nextMatch = matches.find(m => m.round === nextRound && m.id === targetIndex);
    if (!nextMatch) {
      const { data, error } = await supabase.from("tournament_matches").insert([{
        event_id: eventId,
        round: nextRound,
        player_a: matchId % 2 === 0 ? winnerId : null,
        player_b: matchId % 2 === 1 ? winnerId : null
      }]);
      if (error) console.error(error.message);
    } else {
      const fieldToUpdate = matchId % 2 === 0 ? "player_a" : "player_b";
      const { error } = await supabase.from("tournament_matches").update({ [fieldToUpdate]: winnerId }).eq("id", nextMatch.id);
      if (error) console.error(error.message);
    }
  }

  if (loading) return <p>Caricamento torneo...</p>;

  return (
    <div style={{ maxWidth: 800, margin: "20px auto", fontFamily: "sans-serif" }}>
      <h2>{event.name}</h2>
      <p>Posti disponibili: {participants.length} / {event.max_players}</p>

      <form onSubmit={handleRegister} style={{ marginBottom: 20 }}>
        <input name="first_name" placeholder="Nome" value={form.first_name} onChange={handleChange} required />
        <input name="last_name" placeholder="Cognome" value={form.last_name} onChange={handleChange} required />
        <input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} required />
        <input name="phone" placeholder="Cellulare" value={form.phone} onChange={handleChange} required />
        <label>
          <input type="checkbox" name="accepted" checked={form.accepted} onChange={handleChange} /> Accetto il torneo
        </label>
        <button type="submit">Iscriviti</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Tabellone</h3>
      {matches.map((m) => {
        const playerA = participants.find(p => p.id === m.player_a);
        const playerB = participants.find(p => p.id === m.player_b);
        return (
          <div key={m.id} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "center" }}>
            <span>{playerA ? `${playerA.first_name} ${playerA.last_name}` : "bye"}</span>
            <input type="number" placeholder="Score A" value={m.score_a ?? ""} onChange={e => updateScore(m.id, parseInt(e.target.value || 0), m.score_b ?? 0)} />
            <span>vs</span>
            <input type="number" placeholder="Score B" value={m.score_b ?? ""} onChange={e => updateScore(m.id, m.score_a ?? 0, parseInt(e.target.value || 0))} />
            <span>{playerB ? `${playerB.first_name} ${playerB.last_name}` : "bye"}</span>
            {m.winner && <strong style={{ marginLeft: 10 }}>Vincitore: {participants.find(p => p.id === m.winner)?.first_name}</strong>}
          </div>
        );
      })}
    </div>
  );
}
