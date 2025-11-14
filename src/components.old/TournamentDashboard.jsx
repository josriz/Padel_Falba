import React, { useState, useEffect } from "react";
import "./TournamentDashboard.css"; // CSS professionale incluso separatamente
import { supabase } from "../supabaseClient";

const initialMatch = { 
  aIndex: null, 
  bIndex: null, 
  aScore: null, 
  bScore: null, 
  winner: null, 
  field: "" 
};

const generateInitialRound = (playersCount) => {
  const matchesCount = Math.ceil(playersCount / 2);
  return Array(matchesCount).fill(null).map((_, i) => ({
    ...initialMatch,
    aIndex: 2 * i < playersCount ? 2 * i : null,
    bIndex: 2 * i + 1 < playersCount ? 2 * i + 1 : null,
  }));
};

export default function TournamentDashboard({ isAdmin }) {
  const [players, setPlayers] = useState([]);
  const [round16, setRound16] = useState([]);
  const [round8, setRound8] = useState([]);
  const [round4, setRound4] = useState([]);
  const [round2, setRound2] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", surname: "", email: "", phone: "" });
  const [message, setMessage] = useState("");

  // Carica giocatori dal DB
  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("tournament_players").select("*");
    if (!error && data) {
      setPlayers(data);
      setRound16(generateInitialRound(data.length));
      setRound8(Array(Math.ceil(data.length/4)).fill(null).map(() => ({ ...initialMatch })));
      setRound4(Array(Math.ceil(data.length/8)).fill(null).map(() => ({ ...initialMatch })));
      setRound2(Array(Math.ceil(data.length/16)).fill(null).map(() => ({ ...initialMatch })));
    }
    setLoading(false);
  };

  // Registrazione giocatore
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.name || !form.surname || !form.email || !form.phone) {
      setMessage("Compila tutti i campi");
      return;
    }
    if (players.length >= 32) {
      setMessage("Iscrizioni chiuse, posti terminati!");
      return;
    }
    const { error } = await supabase.from("tournament_players").insert([form]);
    if (!error) {
      setForm({ name: "", surname: "", email: "", phone: "" });
      fetchPlayers();
      setMessage("✅ Iscrizione avvenuta!");
    } else {
      setMessage("❌ Errore iscrizione: " + error.message);
    }
  };

  // Aggiornamento punteggi admin
  const updateMatchScore = (round, setRound, matchIndex, side, score) => {
    if (!isAdmin) return;
    let newRound = [...round];
    const match = { ...newRound[matchIndex] };
    const parsedScore = score === "" ? null : parseInt(score, 10);

    if (side === "a") match.aScore = parsedScore;
    else match.bScore = parsedScore;

    if (match.aScore !== null && match.bScore !== null) {
      match.winner = match.aScore > match.bScore ? match.aIndex : match.bScore > match.aScore ? match.bIndex : null;
    } else match.winner = null;

    newRound[matchIndex] = match;
    setRound(newRound);
    advanceWinner(round, matchIndex, match.winner);
  };

  const advanceWinner = (currentRound, matchIndex, winner) => {
    if (!winner) return;
    let nextRound, setNextRound;
    if (currentRound === round16) { nextRound = [...round8]; setNextRound = setRound8; }
    else if (currentRound === round8) { nextRound = [...round4]; setNextRound = setRound4; }
    else if (currentRound === round4) { nextRound = [...round2]; setNextRound = setRound2; }
    else return;

    const targetIndex = Math.floor(matchIndex / 2);
    const slot = matchIndex % 2 === 0 ? "aIndex" : "bIndex";

    let nextMatch = nextRound[targetIndex] || { ...initialMatch };
    nextMatch[slot] = winner;
    nextRound[targetIndex] = nextMatch;
    setNextRound(nextRound);
  };

  const Match = ({ match, matchIndex, round, setRound }) => {
    const playerA = players[match.aIndex];
    const playerB = players[match.bIndex];

    return (
      <div className="match">
        <span>{playerA ? `${playerA.name} ${playerA.surname}` : "bye"}</span>
        <input
          type="number"
          min="0"
          value={match.aScore ?? ""}
          onChange={e => updateMatchScore(round, setRound, matchIndex, "a", e.target.value)}
          disabled={!isAdmin || !playerA}
        />
        <span>vs</span>
        <input
          type="number"
          min="0"
          value={match.bScore ?? ""}
          onChange={e => updateMatchScore(round, setRound, matchIndex, "b", e.target.value)}
          disabled={!isAdmin || !playerB}
        />
        <span>{playerB ? `${playerB.name} ${playerB.surname}` : "bye"}</span>
        {match.winner !== null && <span className="winner">🏆 {players[match.winner]?.name}</span>}
      </div>
    );
  };

  return (
    <div className="tournament-dashboard">
      <h1>Torneo Padel</h1>

      {!isAdmin && (
        <form className="registration-form" onSubmit={handleRegister}>
          <input type="text" placeholder="Nome" value={form.name} onChange={e => setForm({...form, name:e.target.value})} required/>
          <input type="text" placeholder="Cognome" value={form.surname} onChange={e => setForm({...form, surname:e.target.value})} required/>
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} required/>
          <input type="text" placeholder="Cellulare" value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} required/>
          <button type="submit">Iscriviti</button>
          {message && <p className="message">{message}</p>}
        </form>
      )}

      <h2>Tabellone</h2>
      <div className="round">
        <h3>Turno 1</h3>
        {round16.map((m,i) => <Match key={`r16-${i}`} match={m} matchIndex={i} round={round16} setRound={setRound16} />)}
      </div>
      <div className="round">
        <h3>Turno 2</h3>
        {round8.map((m,i) => <Match key={`r8-${i}`} match={m} matchIndex={i} round={round8} setRound={setRound8} />)}
      </div>
      <div className="round">
        <h3>Semifinali</h3>
        {round4.map((m,i) => <Match key={`r4-${i}`} match={m} matchIndex={i} round={round4} setRound={setRound4} />)}
      </div>
      <div className="round">
        <h3>Finale</h3>
        {round2.map((m,i) => <Match key={`r2-${i}`} match={m} matchIndex={i} round={round2} setRound={setRound2} />)}
      </div>
    </div>
  );
}
