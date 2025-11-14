// EventsPage.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import BackButton from "./BackButton";

export default function EventsPage({ user }) {
  const isAdmin = user?.is_admin;
  const maxPlayers = 32;

  const [participants, setParticipants] = useState([]);
  const [round16, setRound16] = useState([]);
  const [round8, setRound8] = useState([]);
  const [round4, setRound4] = useState([]);
  const [round2, setRound2] = useState([]);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", accepted: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { fetchParticipants(); }, []);

  async function fetchParticipants() {
    setLoading(true);
    const { data, error } = await supabase
      .from("tournament_participants")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) console.error(error);
    else {
      setParticipants(data);
      initBracket(data);
    }
    setLoading(false);
  }

  function initBracket(data) {
    const names = data.map(p => `${p.firstName} ${p.lastName}`);
    const matches16 = Array(Math.ceil(names.length / 2)).fill(null).map((_, i) => ({
      aIndex: 2 * i < names.length ? 2 * i : null,
      bIndex: 2 * i + 1 < names.length ? 2 * i + 1 : null,
      aScore: null, bScore: null, winner: null
    }));
    setRound16(matches16);
    setRound8(Array(Math.ceil(matches16.length / 2)).fill(null).map(() => ({ aIndex: null, bIndex: null, aScore: null, bScore: null, winner: null })));
    setRound4(Array(Math.ceil(matches16.length / 4)).fill(null).map(() => ({ aIndex: null, bIndex: null, aScore: null, bScore: null, winner: null })));
    setRound2(Array(Math.ceil(matches16.length / 8)).fill(null).map(() => ({ aIndex: null, bIndex: null, aScore: null, bScore: null, winner: null })));
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (participants.length >= maxPlayers) { setError("⚠️ Torneo completo."); return; }
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.accepted) { setError("⚠️ Compila tutti i campi e accetta il torneo."); return; }

    try {
      const { error } = await supabase.from("tournament_participants").insert([form]);
      if (error) throw error;
      setForm({ firstName: "", lastName: "", email: "", phone: "", accepted: false });
      fetchParticipants();
    } catch (e) { setError("Errore iscrizione: " + e.message); }
  }

  const updateMatchScore = (round, setRound, matchIndex, side, score) => {
    const newRound = [...round];
    const match = { ...newRound[matchIndex] };
    const parsedScore = score === "" ? null : parseInt(score, 10);

    side === "a" ? match.aScore = parsedScore : match.bScore = parsedScore;
    if (match.aScore !== null && match.bScore !== null) match.winner = match.aScore > match.bScore ? match.aIndex : match.bScore > match.aScore ? match.bIndex : null;
    else match.winner = null;

    newRound[matchIndex] = match;
    setRound(newRound);
    advanceWinner(round, matchIndex, match.winner);
  };

  const advanceWinner = (currentRound, matchIndex, winner) => {
    if (winner === null) return;
    let nextRound, setNextRound;
    if (currentRound === round16) { nextRound = [...round8]; setNextRound = setRound8; }
    else if (currentRound === round8) { nextRound = [...round4]; setNextRound = setRound4; }
    else if (currentRound === round4) { nextRound = [...round2]; setNextRound = setRound2; }
    else return;

    const targetIndex = Math.floor(matchIndex / 2);
    const slot = matchIndex % 2 === 0 ? "aIndex" : "bIndex";
    const nextMatch = nextRound[targetIndex] ? { ...nextRound[targetIndex] } : { aIndex: null, bIndex: null, aScore: null, bScore: null, winner: null };
    nextMatch[slot] = winner;
    nextRound[targetIndex] = nextMatch;
    setNextRound(nextRound);
  };

  function Match({ match, teamNameA, teamNameB, onScoreChange, matchIndex, round, setRound }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, backgroundColor: match.winner !== null ? "#d1fae5" : "#f1f5f9", padding: 8, borderRadius: 6 }}>
        <span style={{ flex: 2 }}>{teamNameA || "bye"}</span>
        <input type="number" min="0" style={{ width: 50, padding: 4 }} value={match.aScore ?? ""} onChange={e => onScoreChange(round, setRound, matchIndex, "a", e.target.value)} disabled={teamNameA === null} />
        <span>vs</span>
        <input type="number" min="0" style={{ width: 50, padding: 4 }} value={match.bScore ?? ""} onChange={e => onScoreChange(round, setRound, matchIndex, "b", e.target.value)} disabled={teamNameB === null} />
        <span style={{ flex: 2 }}>{teamNameB || "bye"}</span>
        {match.winner !== null && <span style={{ marginLeft: "auto", fontWeight: "700", color: "#059669" }}>Vincitore: {participants[match.winner]?.firstName} {participants[match.winner]?.lastName}</span>}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: "20px auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <BackButton />
      <h1 style={{ textAlign: "center", color: "#0d9488", marginBottom: 20 }}>Eventi & Tornei</h1>

      {!isAdmin && (
        <div style={{ border: "1px solid #ccc", padding: 20, borderRadius: 12, marginBottom: 20, backgroundColor: "#f0fdfa" }}>
          <h2 style={{ color: "#059669" }}>Iscriviti al torneo</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input type="text" name="firstName" placeholder="Nome" value={form.firstName} onChange={handleChange} style={{ padding: 8, borderRadius: 6, border: "1px solid #94a3b8" }} />
            <input type="text" name="lastName" placeholder="Cognome" value={form.lastName} onChange={handleChange} style={{ padding: 8, borderRadius: 6, border: "1px solid #94a3b8" }} />
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} style={{ padding: 8, borderRadius: 6, border: "1px solid #94a3b8" }} />
            <input type="tel" name="phone" placeholder="Cellulare" value={form.phone} onChange={handleChange} style={{ padding: 8, borderRadius: 6, border: "1px solid #94a3b8" }} />
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input type="checkbox" name="accepted" checked={form.accepted} onChange={handleChange} />
              Accetto il torneo
            </label>
            <button type="submit" disabled={loading || participants.length >= maxPlayers} style={{ padding: 12, borderRadius: 6, backgroundColor: "#0d9488", color: "#fff", fontWeight: "700" }}>
              Iscriviti
            </button>
          </form>
          <p>Partecipanti attuali: {participants.length}/{maxPlayers}</p>
        </div>
      )}

      {isAdmin && (
        <div style={{ marginBottom: 20, padding: 16, borderRadius: 10, backgroundColor: "#f0fdfa" }}>
          <h2 style={{ color: "#059669" }}>Lista Iscritti</h2>
          {loading ? <p>Caricamento...</p> : (
            <ul>
              {participants.map(p => <li key={p.id}>{p.firstName} {p.lastName} - {p.email} - {p.phone}</li>)}
            </ul>
          )}
        </div>
      )}

      <div>
        <h2 style={{ color: "#0d9488", marginBottom: 10 }}>Tabellone torneo</h2>
        <h3>Turno 1</h3>
        {round16.map((match, i) => <Match key={`r16-${i}`} match={match} teamNameA={participants[match.aIndex]?.firstName + " " + participants[match.aIndex]?.lastName} teamNameB={participants[match.bIndex]?.firstName + " " + participants[match.bIndex]?.lastName} onScoreChange={updateMatchScore} matchIndex={i} round={round16} setRound={setRound16} />)}
        <h3>Turno 2</h3>
        {round8.map((match, i) => <Match key={`r8-${i}`} match={match} teamNameA={participants[match.aIndex]?.firstName + " " + participants[match.aIndex]?.lastName} teamNameB={participants[match.bIndex]?.firstName + " " + participants[match.bIndex]?.lastName} onScoreChange={updateMatchScore} matchIndex={i} round={round8} setRound={setRound8} />)}
        <h3>Semifinali</h3>
        {round4.map((match, i) => <Match key={`r4-${i}`} match={match} teamNameA={participants[match.aIndex]?.firstName + " " + participants[match.aIndex]?.lastName} teamNameB={participants[match.bIndex]?.firstName + " " + participants[match.bIndex]?.lastName} onScoreChange={updateMatchScore} matchIndex={i} round={round4} setRound={setRound4} />)}
        <h3>Finale</h3>
        {round2.map((match, i) => <Match key={`r2-${i}`} match={match} teamNameA={participants[match.aIndex]?.firstName + " " + participants[match.aIndex]?.lastName} teamNameB={participants[match.bIndex]?.firstName + " " + participants[match.bIndex]?.lastName} onScoreChange={updateMatchScore} matchIndex={i} round={round2} setRound={setRound2} />)}
      </div>
    </div>
  );
}
