import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";

export default function TournamentDashboard({ isAdmin }) {
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", surname: "", email: "", phone: "" });
  const [message, setMessage] = useState("");

  const organizeMatchesByRound = useCallback((allMatches) => {
    const rounds = {};
    allMatches.forEach(match => {
      const roundName = `round${match.round_number}`;
      if (!rounds[roundName]) rounds[roundName] = [];
      rounds[roundName].push(match);
    });
    const sortedKeys = Object.keys(rounds).sort((a, b) => parseInt(a.replace('round', '')) - parseInt(b.replace('round', '')));
    const sortedRounds = {};
    sortedKeys.forEach(key => {
      rounds[key].sort((a, b) => (a.match_index || 0) - (b.match_index || 0));
      sortedRounds[key] = rounds[key];
    });
    return sortedRounds;
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setMessage("");
    try {
      const { data: pData, error: pError } = await supabase.from("tournament_players").select("id, name, surname");
      if (pError) throw pError;
      setPlayers(pData);

      const { data: mData, error: mError } = await supabase.from("tournament_matches")
        .select("*")
        .order("round_number", { ascending: false })
        .order("match_index", { ascending: true });
      if (mError) throw mError;
      setMatches(mData || []);
    } catch (e) {
      console.error("Errore fetchData:", e.message);
      setMessage("Errore caricamento dati: " + e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    const { error } = await supabase.from("tournament_players").insert([{ ...form, created_at: new Date().toISOString() }]);
    if (!error) {
      setForm({ name: "", surname: "", email: "", phone: "" });
      fetchData();
      setMessage("✅ Iscrizione avvenuta!");
    } else {
      setMessage("❌ Errore iscrizione: " + error.message);
    }
  };

  const advanceWinner = async (currentMatch, winnerId) => {
    if (currentMatch.round_number === 2 && currentMatch.match_index === 0) return;
    const nextRound = currentMatch.round_number / 2;
    const targetIndex = Math.floor(currentMatch.match_index / 2);
    const fieldToUpdate = currentMatch.match_index % 2 === 0 ? "player_a_id" : "player_b_id";
    const nextMatch = matches.find(m => m.round_number === nextRound && m.match_index === targetIndex);
    if (!nextMatch) {
      const payload = {
        round_number: nextRound,
        match_index: targetIndex,
        [fieldToUpdate]: winnerId,
        player_a_id: fieldToUpdate === "player_a_id" ? winnerId : null,
        player_b_id: fieldToUpdate === "player_b_id" ? winnerId : null,
      };
      const { error: insertError } = await supabase.from("tournament_matches").insert(payload);
      if (insertError) console.error("Errore creazione match successivo:", insertError.message);
    } else {
      const { error: dbUpdateError } = await supabase.from("tournament_matches").update({ [fieldToUpdate]: winnerId }).eq("id", nextMatch.id);
      if (dbUpdateError) console.error("Errore aggiornamento match successivo:", dbUpdateError.message);
    }
    fetchData();
  };

  const updateMatchScore = async (match, side, score) => {
    if (!isAdmin) {
      setMessage("Non hai i permessi per aggiornare il punteggio.");
      return;
    }
    if (!match.player_a_id || !match.player_b_id) {
      setMessage("Impossibile aggiornare: Giocatori non assegnati.");
      return;
    }
    const parsedScore = score === "" ? null : parseInt(score, 10);
    let currentScoreA = side === "a" ? parsedScore : match.score_a;
    let currentScoreB = side === "b" ? parsedScore : match.score_b;
    const updatePayload = { score_a: currentScoreA, score_b: currentScoreB, winner_id: null };
    let winnerId = null;
    if (currentScoreA !== null && currentScoreB !== null) {
      if (currentScoreA > currentScoreB) winnerId = match.player_a_id;
      else if (currentScoreB > currentScoreA) winnerId = match.player_b_id;
      updatePayload.winner_id = winnerId;
    }
    setMatches(prevMatches => prevMatches.map(m =>
      m.id === match.id ? { ...m, ...updatePayload, score_a: currentScoreA, score_b: currentScoreB, winner_id: winnerId } : m
    ));
    const { error } = await supabase.from("tournament_matches").update(updatePayload).eq("id", match.id);
    if (error) {
      setMessage("❌ Errore nel salvataggio del punteggio.");
    } else {
      setMessage("Punteggio aggiornato!");
      if (winnerId) await advanceWinner({ ...match, ...updatePayload }, winnerId);
    }
  };

  const Match = ({ match }) => {
    const playerA = players.find(p => p.id === match.player_a_id);
    const playerB = players.find(p => p.id === match.player_b_id);
    const winner = players.find(p => p.id === match.winner_id);

    return (
      <div className={`flex flex-wrap gap-2 items-center p-3 border rounded ${match.winner_id ? 'bg-green-100' : 'bg-white'}`}>
        <div className="flex items-center flex-grow min-w-[45%]">
          <span className={`flex-grow ${match.winner_id === playerA?.id ? 'font-bold' : ''}`}>
            {playerA ? `${playerA.name} ${playerA.surname}` : "Giocatore A (TBD)"}
          </span>
          <input type="number" min="0" placeholder="A" className="w-14 p-1 text-center border rounded"
            value={match.score_a ?? ""}
            onChange={e => updateMatchScore(match, "a", e.target.value)}
            disabled={!isAdmin || !playerA || winner} />
        </div>

        <span className="flex-shrink-0">-</span>

        <div className="flex items-center flex-grow min-w-[45%] justify-end">
          <input type="number" min="0" placeholder="B" className="w-14 p-1 text-center border rounded mr-1"
            value={match.score_b ?? ""}
            onChange={e => updateMatchScore(match, "b", e.target.value)}
            disabled={!isAdmin || !playerB || winner} />
          <span className={`flex-grow text-right ${match.winner_id === playerB?.id ? 'font-bold' : ''}`}>
            {playerB ? `${playerB.name} ${playerB.surname}` : "Giocatore B (TBD)"}
          </span>
        </div>

        {winner && <span className="text-green-700 font-bold w-full text-center mt-2">
          🏆 Vincitore: {winner.name} {winner.surname}
        </span>}
      </div>
    );
  };

  const organizedRounds = organizeMatchesByRound(matches);

  if (loading) return <p className="p-5">Caricamento torneo...</p>;

  return (
    <div className="p-5 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Torneo Padel</h1>

      {!isAdmin && (
        <form onSubmit={handleRegister} className="flex flex-col gap-4 mb-8 p-5 border border-gray-300 rounded-lg" >
          <input
            type="text" placeholder="Nome" className="p-3 border border-gray-300 rounded"
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input
            type="text" placeholder="Cognome" className="p-3 border border-gray-300 rounded"
            value={form.surname} onChange={e => setForm({ ...form, surname: e.target.value })} required />
          <input
            type="email" placeholder="Email" className="p-3 border border-gray-300 rounded"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input
            type="text" placeholder="Cellulare" className="p-3 border border-gray-300 rounded"
            value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
          <button type="submit"
            className="bg-blue-600 text-white py-3 rounded hover:bg-blue-700 cursor-pointer">
            Iscriviti
          </button>
          <p className={`mt-2 ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>
        </form>
      )}

      <h2 className="text-2xl mb-4">Tabellone Ufficiale</h2>
      <div className="flex space-x-8 overflow-x-auto pb-4">
        {Object.keys(organizedRounds).sort((a, b) => parseInt(b.replace('round', '')) - parseInt(a.replace('round', ''))).map(roundKey => {
          const roundNumber = organizedRounds[roundKey][0]?.round_number;
          if (!roundNumber) return null;

          return (
            <div key={roundKey} className="min-w-[300px] last:mr-0">
              <h3 className="border-b-2 border-gray-300 pb-1">{roundNumber === 16 ? "Sedicesimi" : roundNumber === 8 ? "Quarti" : roundNumber === 4 ? "Semifinali" : roundNumber === 2 ? "Finale" : `Round ${roundNumber}`}</h3>
              {organizedRounds[roundKey].map(m => (
                <Match key={m.id} match={m} />
              ))}
            </div>
          );
        })}
        {matches.length === 0 && <p>Nessun match caricato. L'Admin deve inizializzare il primo round nel DB.</p>}
      </div>
    </div>
  );
}
