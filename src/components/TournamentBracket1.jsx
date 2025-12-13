// src/components/TournamentBracket.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Loader2, Trophy, ArrowLeft } from "lucide-react";

export default function TournamentBracket({ tournamentId, onBack }) {
  const [participants, setParticipants] = useState([]);
  const [bracket, setBracket] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({});

  const PHASES = ["Ottavi", "Quarti", "Semifinali", "Finale"];

  // Carica iscritti reali dal torneo
  const fetchParticipants = async () => {
    setLoading(true);
    try {
      console.log("🔍 Carico iscritti reali per torneo:", tournamentId);

      const { data: registrations, error } = await supabase
        .from("tournament_registrations")
        .select("*")
        .eq("tournament_id", tournamentId)
        .order("created_at");

      if (error) throw error;
      if (!registrations || registrations.length === 0) {
        setParticipants([]);
        setBracket([]);
        return;
      }

      // Prendi nomi reali dal campo full_name o display_name
      const players = registrations.map((reg, i) => ({
        id: reg.user_id,
        fullName: reg.full_name?.trim() || reg.display_name?.trim() || `Giocatore ${i + 1}`,
      }));

      setParticipants(players);

      // Creo tabellone 2vs2: 4 giocatori per partita
      const matches = [];
      for (let i = 0; i < players.length; i += 4) {
        matches.push({
          id: `match-${i / 4}`,
          field: i / 4 + 1,
          players: players.slice(i, i + 4),
          score: "",
          eliminated: false,
        });
      }

      setBracket(matches);

      // Statistiche iniziali
      setStats({ total: players.length, eliminated: 0, ripescati: 0 });
    } catch (err) {
      console.error("💥 Errore fetch partecipanti:", err);
      setParticipants([]);
      setBracket([]);
    } finally {
      setLoading(false);
    }
  };

  // Gestione punteggio
  const handleScoreChange = (matchIndex, value) => {
    const updated = [...bracket];
    updated[matchIndex].score = value;
    setBracket(updated);
  };

  // Drag & drop
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e, matchIndex, playerIndex) => {
    e.preventDefault();
    const player = JSON.parse(e.dataTransfer.getData("text/plain"));
    const updated = [...bracket];
    updated[matchIndex].players[playerIndex] = player;
    setBracket(updated);
  };

  const removePlayerFromSlot = (matchIndex, playerIndex) => {
    const updated = [...bracket];
    updated[matchIndex].players[playerIndex] = null;
    setBracket(updated);
  };

  // Ripescaggio squadra eliminata
  const ripescaggio = (matchIndex) => {
    const updated = [...bracket];
    if (!updated[matchIndex].eliminated) return;
    updated[matchIndex].eliminated = false;
    setBracket(updated);
    setStats((prev) => ({ ...prev, ripescati: prev.ripescati + 1 }));
  };

  // Salva tabellone
  const saveBracket = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("tournament_bracket")
        .upsert({
          tournament_id: tournamentId,
          bracket_data: bracket,
          slots_filled: bracket.reduce(
            (acc, m) => acc + m.players.filter(Boolean).length,
            0
          ),
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      alert(
        `✅ Salvato ${
          bracket.reduce((acc, m) => acc + m.players.filter(Boolean).length, 0)
        }/${participants.length}`
      );
    } catch (err) {
      console.error(err);
      alert("❌ Errore salvataggio");
    } finally {
      setSaving(false);
    }
  };

  const resetBracket = () => {
    const reset = bracket.map((m) => ({
      ...m,
      players: Array(4).fill(null),
      score: "",
      eliminated: false,
    }));
    setBracket(reset);
    setStats({ total: participants.length, eliminated: 0, ripescati: 0 });
  };

  useEffect(() => {
    if (tournamentId) fetchParticipants();
  }, [tournamentId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">

        {/* Bottone Indietro */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white bg-gray-500 hover:bg-gray-600 px-6 py-3 rounded-xl font-bold"
          >
            <ArrowLeft className="w-5 h-5" />
            Indietro
          </button>
        )}

        <h1 className="text-2xl font-black">Giocatori iscritti ({participants.length})</h1>

        <div className="flex gap-8">
          {/* Lista giocatori draggabili */}
          <div className="w-1/3 bg-white p-4 rounded-xl shadow max-h-[600px] overflow-y-auto">
            {participants.map((p) => (
              <div
                key={p.id}
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData("text/plain", JSON.stringify(p))
                }
                className="p-2 mb-2 bg-emerald-100 rounded cursor-grab hover:bg-emerald-200"
              >
                {p.fullName}
              </div>
            ))}
          </div>

          {/* Tabellone */}
          <div className="flex-1 space-y-6">
            {bracket.map((match, idx) => (
              <div
                key={match.id}
                className={`p-4 mb-4 bg-blue-50 rounded-xl shadow space-y-2 ${
                  match.eliminated ? "opacity-50" : ""
                }`}
              >
                <h3 className="font-bold mb-2">Campo {match.field}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {match.players.map((player, pi) => (
                    <div
                      key={pi}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, idx, pi)}
                      className="p-2 bg-white rounded shadow text-center min-h-[40px] flex items-center justify-center relative"
                    >
                      {player ? (
                        <>
                          {player.fullName}
                          <button
                            onClick={() => removePlayerFromSlot(idx, pi)}
                            className="absolute top-1 right-1 text-xs bg-red-500 text-white rounded-full w-5 h-5"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-400 text-xs">Slot {pi + 1}</span>
                      )}
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  value={match.score}
                  placeholder="0-0"
                  onChange={(e) => handleScoreChange(idx, e.target.value)}
                  className="border mt-2 rounded w-24 text-center"
                />
                {match.eliminated && (
                  <button
                    onClick={() => ripescaggio(idx)}
                    className="mt-2 px-3 py-1 bg-yellow-400 text-white rounded font-bold"
                  >
                    Ripescaggio
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Salva / Reset */}
        <div className="flex gap-4">
          <button
            onClick={saveBracket}
            disabled={saving}
            className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold flex justify-center gap-2"
          >
            {saving ? <Loader2 className="animate-spin" /> : <Trophy />}
            Salva tabellone
          </button>

          <button
            onClick={resetBracket}
            className="bg-gray-400 text-white px-6 rounded-xl font-bold"
          >
            Reset
          </button>
        </div>

        {/* Statistiche */}
        <div className="mt-6 p-4 bg-gray-100 rounded-xl border border-gray-300">
          <h3 className="font-bold mb-2">Statistiche</h3>
          <p>Totale iscritti: {stats.total}</p>
          <p>Eliminati: {stats.eliminated}</p>
          <p>Ripescati: {stats.ripescati}</p>
        </div>
      </div>
    </div>
  );
}
