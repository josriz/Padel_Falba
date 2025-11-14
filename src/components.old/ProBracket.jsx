// ProBracket.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import BackButton from "./BackButton";

export default function ProBracket({ user }) {
  const isAdmin = user?.is_admin;
  const maxPlayers = 32;

  const [participants, setParticipants] = useState([]);
  const [bracket, setBracket] = useState([]);
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
    const totalMatches = Math.pow(2, Math.ceil(Math.log2(data.length))) / 2;
    const initialBracket = Array(totalMatches).fill(null).map(() => ({
      playerA: null,
      playerB: null,
      scoreA: null,
      scoreB: null,
      winner: null
    }));
    data.forEach((p, i) => {
      const matchIndex = Math.floor(i / 2);
      const slot = i % 2 === 0 ? "playerA" : "playerB";
      initialBracket[matchIndex][slot] = i;
    });
    setBracket([initialBracket]); // primo turno
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

  const updateScore = (roundIndex, matchIndex, side, value) => {
    const newBracket = [...bracket];
    const match = { ...newBracket[roundIndex][matchIndex] };
    match[side === "a" ? "scoreA" : "scoreB"] = value === "" ? null : parseInt(value, 10);

    if (match.scoreA !== null && match.scoreB !== null) {
      if (match.scoreA > match.scoreB) match.winner = match.playerA;
      else if (match.scoreB > match.scoreA) match.winner = match.playerB;
      else match.winner = null;
    } else match.winner = null;

    newBracket[roundIndex][matchIndex] = match;
    setBracket(newBracket);
    propagateWinner(roundIndex, matchIndex, match.winner);
  };

  const propagateWinner = (roundIndex, matchIndex, winner) => {
    if (winner === null) return;
    if (roundIndex + 1 >= bracket.length) {
      const nextRoundSize = Math.ceil(bracket[roundIndex].length / 2);
      bracket.push(Array(nextRoundSize).fill(null).map(() => ({ playerA: null, playerB: null, scoreA: null, scoreB: null, winner: null })));
    }
    const nextMatchIndex = Math.floor(matchIndex / 2);
    const slot = matchIndex % 2 === 0 ? "playerA" : "playerB";
    const nextRound = [...bracket[roundIndex + 1]];
    const nextMatch = { ...nextRound[nextMatchIndex] };
    nextMatch[slot] = winner;
    nextRound[nextMatchIndex] = nextMatch;

    const newBracket = [...bracket];
    newBracket[roundIndex + 1] = nextRound;
    setBracket(newBracket);
  };

  const MatchCard = ({ match, roundIndex, matchIndex }) => {
    const playerA = participants[match.playerA];
    const playerB = participants[match.playerB];
    const winner = match.winner !== null ? participants[match.winner] : null;

    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        padding: 8,
        borderRadius: 8,
        backgroundColor: winner ? "#d1fae5" : "#f1f5f9",
        marginBottom: 12,
        transition: "0.3s",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        position: "relative"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: winner?.id === playerA?.id ? "700" : "400" }}>{playerA ? `${playerA.firstName} ${playerA.lastName}` : "bye"}</span>
          {isAdmin && playerA && <input type="number" style={{ width: 50 }} value={match.scoreA ?? ""} onChange={e => updateScore(roundIndex, matchIndex, "a", e.target.value)} />}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
          <span style={{ fontWeight: winner?.id === playerB?.id ? "700" : "400" }}>{playerB ? `${playerB.firstName} ${playerB.lastName}` : "bye"}</span>
          {isAdmin && playerB && <input type="number" style={{ width: 50 }} value={match.scoreB ?? ""} onChange={e => updateScore(roundIndex, matchIndex, "b", e.target.value)} />}
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 1200, margin: "20px auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <BackButton />
      <h1 style={{ textAlign: "center", color: "#0d9488", marginBottom: 20 }}>Tabellone Professionale</h1>

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

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {bracket.map((round, i) => (
          <div key={`round-${i}`} style={{ flex: 1, minWidth: 200 }}>
            <h3 style={{ textAlign: "center", color: "#0d9488" }}>Turno {i + 1}</h3>
            {round.map((match, j) => <MatchCard key={`match-${i}-${j}`} match={match} roundIndex={i} matchIndex={j} />)}
          </div>
        ))}
      </div>
    </div>
  );
}
