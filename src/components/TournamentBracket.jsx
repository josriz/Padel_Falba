// src/components/TournamentBracket.jsx - IDENTICO AL TUO + FIX NOMI
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Loader2, Trophy, ArrowLeft, Printer } from "lucide-react";

export default function TournamentBracket({ tournamentId, onBack }) {
  const [participants, setParticipants] = useState([]);
  const [bracket, setBracket] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rescued, setRescued] = useState([]);

  const PHASES = ["Ottavi", "Quarti", "Semifinali", "Finale"];

  // ✅ FIX: Usa full_name dalla registrazione (già corretto dal trigger)
  const fetchRealParticipants = async () => {
    setLoading(true);
    try {
      console.log("🔍 Carico iscritti reali per torneo:", tournamentId);

      const { data: registrations, error: regError } = await supabase
        .from("tournament_registrations")
        .select("id, user_id, full_name, display_name, level, created_at")
        .eq("tournament_id", tournamentId)
        .order("created_at");

      if (regError) throw regError;

      if (!registrations || registrations.length === 0) {
        setParticipants([]);
        setBracket([]);
        setLoading(false);
        return;
      }

      // ✅ Usa NOME dalla registrazione (corretto dal trigger SQL)
      const players = registrations.slice(0, 16).map((reg, i) => ({
        id: reg.user_id,
        fullName: reg.full_name !== 'Giocatore Sconosciuto' 
                 ? reg.full_name 
                 : reg.display_name || `Giocatore ${i + 1}`
      }));

      setParticipants(players);

      // Tabellone 2vs2 (TUO CODICE IDENTICO)
      const matches = [];
      for (let i = 0; i < players.length; i += 4) {
        matches.push({
          id: `match-${i / 4}`,
          field: i / 4 + 1,
          players: players.slice(i, i + 4),
          score: "",
          phase: PHASES[Math.log2(players.length / 2 / (i / 4 + 1))] || "Ottavi",
        });
      }
      setBracket(matches);

      console.log("✅ Partecipanti caricati:", players);
    } catch (err) {
      console.error("💥 Errore fetch partecipanti:", err);
      setParticipants([]);
      setBracket([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ TUTTO IL RESTO IDENTICO AL TUO CODICE
  const handleScoreChange = (matchIndex, value) => {
    const updated = [...bracket];
    updated[matchIndex].score = value;
    setBracket(updated);
  };

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
        }/16`
      );
    } catch (err) {
      console.error(err);
      alert("❌ Errore salvataggio");
    } finally {
      setSaving(false);
    }
  };

  const rescuePlayer = (player) => {
    if (!rescued.find((p) => p.id === player.id)) {
      setRescued([...rescued, player]);
    }
  };

  const resetBracket = () => {
    const reset = bracket.map((m) => ({
      ...m,
      players: Array(4).fill(null),
      score: "",
    }));
    setBracket(reset);
    setRescued([]);
  };

  useEffect(() => {
    if (tournamentId) fetchRealParticipants();
  }, [tournamentId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      </div>
    );

  // ✅ JSX COMPLETAMENTE IDENTICO AL TUO
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <div className="flex justify-between items-center">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white bg-gray-500 hover:bg-gray-600 px-6 py-3 rounded-xl font-bold"
            >
              <ArrowLeft className="w-5 h-5" />
              Indietro
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 text-white bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl font-bold"
          >
            <Printer className="w-5 h-5" />
            Stampa
          </button>
        </div>

        <h1 className="text-2xl font-black">Giocatori iscritti ({participants.length})</h1>

        <div className="flex gap-8">
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
                {p.fullName}{" "}
                <button
                  onClick={() => rescuePlayer(p)}
                  className="ml-2 text-xs bg-yellow-400 text-white rounded px-1"
                >
                  Ripescaggio
                </button>
              </div>
            ))}
          </div>

          <div className="flex-1 space-y-6">
            {bracket.map((match, idx) => (
              <div
                key={match.id}
                className="p-4 mb-4 bg-blue-50 rounded-xl shadow space-y-2"
              >
                <h3 className="font-bold mb-2">
                  Campo {match.field} - {match.phase}
                </h3>
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
              </div>
            ))}
          </div>
        </div>

        {rescued.length > 0 && (
          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 mt-4">
            <h2 className="font-bold mb-2">Ripescaggi</h2>
            <ul>
              {rescued.map((p) => (
                <li key={p.id}>{p.fullName}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-4 mt-6">
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
      </div>
    </div>
  );
}
