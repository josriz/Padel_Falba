import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthProvider";
import { Users, Loader2, Edit } from "lucide-react";

export default function TournamentBracket({ tournamentId, bracketSlots, setBracketSlots }) {
  const { isAdmin } = useAuth();
  const [matches, setMatches] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMatchId, setEditingMatchId] = useState(null);
  const [matchData, setMatchData] = useState({ player1: "", player2: "", player3: "", player4: "" });

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, slotIndex) => {
    e.preventDefault();
    const playerData = JSON.parse(e.dataTransfer.getData("text/plain"));
    const newSlots = [...bracketSlots];
    newSlots[slotIndex] = playerData;
    setBracketSlots(newSlots);
  };

  useEffect(() => {
    if (!tournamentId) {
      setLoading(false);
      return;
    }
    fetchMatches();
    fetchParticipants();
  }, [tournamentId]);

  const fetchMatches = async () => {
    try {
      const { data } = await supabase
        .from("tournament_matches")
        .select("*")
        .eq("tournament_id", tournamentId)
        .order("round_number", { ascending: true })
        .order("match_index", { ascending: true });

      setMatches(data || []);
    } catch {
      setMatches([]);
    }
  };

  const fetchParticipants = async () => {
    try {
      const { data } = await supabase
        .from("tournament_participants")
        .select("id, nome, cognome, email, user_id")
        .eq("tournament_id", tournamentId);

      setParticipants(data || []);
    } catch {
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditMatch = (match) => {
    setEditingMatchId(match.id);
    setMatchData({
      player1: match.player1 || "",
      player2: match.player2 || "",
      player3: match.player3 || "",
      player4: match.player4 || "",
    });
  };

  const handleSaveMatch = async (matchId) => {
    try {
      const { error } = await supabase
        .from("tournament_matches")
        .update(matchData)
        .eq("id", matchId);

      if (error) throw error;
      setEditingMatchId(null);
      fetchMatches();
    } catch (err) {
      alert("Errore salvataggio match: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin w-10 h-10 text-gray-600" />
      </div>
    );
  }

  return (
    <div className="p-8 bg-white text-gray-900">
      <h2 className="text-3xl font-bold mb-6">🏆 Tabellone Torneo</h2>

      {/* INFO BOX */}
      <div className="p-4 border rounded-xl bg-white mb-6">
        <div className="flex items-center gap-3 text-gray-800">
          <Users className="w-6 h-6" />
          <span>
            Slot occupati: <strong>{bracketSlots.filter(Boolean).length}</strong>/32
          </span>
        </div>
      </div>

      {/* 32 SLOT */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {bracketSlots.map((slot, index) => (
          <div
            key={index}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            title={slot ? `${slot.nome} ${slot.cognome}` : `Slot ${index + 1}`}
            className={`p-4 rounded-xl border min-h-[80px] flex flex-col items-center justify-center text-sm 
              ${slot ? "bg-gray-100 border-gray-300" : "bg-white border-gray-300"} 
            `}
          >
            {slot ? (
              <div className="text-center w-full">
                <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-1">
                  <span className="text-white font-bold text-sm">
                    {(slot.nome || slot.email)?.[0]?.toUpperCase() || "?"}
                  </span>
                </div>

                <div className="font-semibold text-gray-900 text-xs px-1 break-words">
                  {`${slot.nome || ""} ${slot.cognome || ""}`.trim() ||
                    slot.email ||
                    "Slot occupato"}
                </div>
              </div>
            ) : (
              <span className="text-xs font-medium text-gray-600">Slot {index + 1}</span>
            )}
          </div>
        ))}
      </div>

      {/* MATCH LIST */}
      {matches.length > 0 && (
        <div className="mt-12 p-6 border rounded-xl bg-white">
          <h3 className="text-xl font-bold mb-4">⚽ Match Programmati</h3>

          {matches.map((match) => (
            <div key={match.id} className="border rounded-xl p-4 bg-white mb-3">
              <div className="flex justify-between items-center">
                <span>
                  Match {match.match_index} - Round {match.round_number}
                </span>

                {isAdmin && (
                  <button
                    onClick={() => handleEditMatch(match)}
                    className="px-3 py-1 bg-gray-800 text-white rounded text-sm"
                  >
                    <Edit className="w-4 h-4 inline mr-1" /> Modifica
                  </button>
                )}
              </div>

              {editingMatchId === match.id && (
                <div className="mt-3 space-y-2">
                  {["player1", "player2", "player3", "player4"].map((key) => (
                    <input
                      key={key}
                      value={matchData[key]}
                      onChange={(e) =>
                        setMatchData((prev) => ({ ...prev, [key]: e.target.value }))
                      }
                      className="w-full border p-2 rounded"
                    />
                  ))}

                  <button
                    onClick={() => handleSaveMatch(match.id)}
                    className="px-4 py-2 bg-gray-900 text-white rounded"
                  >
                    Salva
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
