import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthProvider";
import { Users, Loader2, Edit, Mail } from "lucide-react";

export default function TournamentBracket({ tournamentId, bracketSlots, setBracketSlots }) {
  const { isAdmin, user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMatchId, setEditingMatchId] = useState(null);
  const [matchData, setMatchData] = useState({ player1: "", player2: "", player3: "", player4: "" });

  // ✅ DRAG & DROP HANDLERS
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, slotIndex) => {
    e.preventDefault();
    const playerData = JSON.parse(e.dataTransfer.getData('text/plain'));
    console.log('🎾 DROP SLOT', slotIndex, playerData);
    
    const newSlots = [...bracketSlots];
    newSlots[slotIndex] = playerData;
    setBracketSlots(newSlots);
  };

  useEffect(() => {
    if (!tournamentId) {
      setLoading(false);
      return;
    }
    console.log('✅ TournamentBracket ID:', tournamentId);
    fetchMatches();
    fetchParticipants();
  }, [tournamentId]);

  const fetchMatches = async () => {
    try {
      const { data, error } = await supabase
        .from("tournament_matches")
        .select("*")
        .eq("tournament_id", tournamentId)
        .order("round_number", { ascending: true })
        .order("match_index", { ascending: true });
      
      if (error) {
        console.log('ℹ️ Nessun match trovato (normale):', error.message);
      } else {
        console.log('✅ MATCHES trovati:', data?.length || 0);
        setMatches(data || []);
      }
    } catch (err) {
      console.error('❌ tournament_matches:', err);
    }
  };

  const fetchParticipants = async () => {
    try {
      const { data, error } = await supabase
        .from("tournament_participants")
        .select("id, nome, cognome, email, user_id")
        .eq("tournament_id", tournamentId);
      
      if (error) {
        console.error('❌ tournament_participants ERROR:', error);
        setParticipants([]);
      } else {
        console.log('✅ TournamentBracket PARTICIPANTI:', data?.length || 0);
        setParticipants(data || []);
      }
    } catch (err) {
      console.error('❌ fetchParticipants:', err);
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
        <Loader2 className="animate-spin w-12 h-12 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold mb-4 text-center">🏆 Tabellone Torneo</h2>

      <div className="bg-blue-50 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-blue-600" />
          <span>Slot occupati: <strong>{bracketSlots.filter(Boolean).length}</strong>/32</span>
        </div>
      </div>

      {/* 32 SLOT DRAG & DROP */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {bracketSlots.map((slot, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl border-2 transition-all min-h-[80px] flex flex-col items-center justify-center text-sm font-medium cursor-pointer group ${
              slot 
                ? 'bg-emerald-100 border-emerald-400 shadow-md hover:shadow-lg' 
                : 'bg-white/50 border-dashed border-indigo-300 hover:border-indigo-400 hover:bg-indigo-50'
            }`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            title={slot ? `${slot.nome} ${slot.cognome}` : `Slot ${index + 1}`}
          >
            {slot ? (
              <div className="text-center w-full">
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center mb-1 mx-auto shadow group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-sm">
                    {(slot.nome || slot.email)?.[0]?.toUpperCase() || '?'}
                  </span>
                </div>
                <div className="font-semibold text-emerald-800 text-xs leading-tight whitespace-normal break-words max-w-full px-1">
                  {`${slot.nome || ''} ${slot.cognome || ''}`.trim() || slot.email || 'Slot occupato'}
                </div>
              </div>
            ) : (
              <span className="text-xs font-medium text-gray-600 group-hover:text-indigo-600">Slot {index + 1}</span>
            )}
          </div>
        ))}
      </div>

      {matches.length > 0 && (
        <div className="mt-12 p-6 bg-gray-50 rounded-2xl">
          <h3 className="text-xl font-bold mb-4 text-gray-800">⚽ Match Programmati</h3>
          {matches.map((match) => (
            <div key={match.id} className="bg-white p-4 rounded-xl shadow-sm mb-3">
              <div className="flex justify-between items-center">
                <span>Match {match.match_index} - Round {match.round_number}</span>
                {isAdmin && (
                  <button onClick={() => handleEditMatch(match)} className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
                    <Edit className="w-4 h-4 inline mr-1" /> Modifica
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
