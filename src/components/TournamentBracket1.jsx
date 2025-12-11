// src/components/TournamentBracket.jsx - COMPLETO CON ISCRITTI VISIBILI
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthProvider";
import { Users, Loader2, Trophy } from "lucide-react";

export default function TournamentBracket({
  tournamentId = null,
  bracketSlots = [],
  setBracketSlots = () => {},
  onParticipantsRefresh = () => {}
}) {
  const { isAdmin } = useAuth();
  const [participants, setParticipants] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Drag & Drop
  const handleDragOver = (e) => e.preventDefault();
  
  const handleDrop = (e, slotIndex) => {
    e.preventDefault();
    try {
      const playerData = JSON.parse(e.dataTransfer.getData("text/plain"));
      const newSlots = [...bracketSlots];
      newSlots[slotIndex] = playerData;
      setBracketSlots(newSlots);
    } catch (err) {
      console.error("Errore drop:", err);
    }
  };
  
  const removePlayerFromSlot = (slotIndex) => {
    const newSlots = [...bracketSlots];
    newSlots[slotIndex] = null;
    setBracketSlots(newSlots);
  };

  const filledSlotsCount = bracketSlots.filter(Boolean).length;

  // SALVA BRACKET
  const saveBracket = async () => {
    try {
      const filledSlots = bracketSlots.filter(Boolean);
      const { error } = await supabase
        .from('tournament_bracket')
        .upsert([{
          tournament_id: tournamentId,
          bracket_data: JSON.stringify(bracketSlots),
          slots_filled: filledSlotsCount,
          updated_at: new Date().toISOString()
        }]);
      if (error) {
        console.error('❌ Salvataggio fallito:', error);
        alert('❌ Errore salvataggio!');
      } else {
        alert(`✅ Tabellone salvato! ${filledSlotsCount}/16 slot occupati`);
      }
    } catch (err) {
      console.error('💥 Errore saveBracket:', err);
      alert('❌ Errore salvataggio!');
    }
  };

  const resetBracket = () => {
    if (confirm('Resettare tutto il tabellone?')) {
      setBracketSlots(Array(16).fill(null));
    }
  };

  // CARICA BRACKET SALVATO
  const loadSavedBracket = async () => {
    try {
      const { data } = await supabase
        .from('tournament_bracket')
        .select('bracket_data')
        .eq('tournament_id', tournamentId)
        .single();
      if (data && data.bracket_data) {
        setBracketSlots(JSON.parse(data.bracket_data));
      }
    } catch {}
  };

  // FETCH ISCRITTI
  const fetchParticipants = async () => {
    setLoading(true);
    try {
      const { data: registrations } = await supabase
        .from('tournament_registrations')
        .select('*')
        .eq('tournament_id', tournamentId);

      const participantsData = await Promise.all(
        registrations.map(async (reg) => {
          const { data: user } = await supabase
            .from('users')
            .select('id, email, raw_user_meta_data')
            .eq('id', reg.user_id)
            .single();

          return {
            id: reg.user_id,
            nome: user?.raw_user_meta_data?.nome || 'Giocatore',
            cognome: user?.raw_user_meta_data?.cognome || '',
            email: user?.email || 'N/D'
          };
        })
      );

      setParticipants(participantsData);
    } catch (err) {
      console.error('Errore fetchParticipants:', err);
      setParticipants([]);
    } finally {
      setLoading(false);
      if (onParticipantsRefresh) onParticipantsRefresh();
    }
  };

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

  useEffect(() => {
    if (!tournamentId) return;
    fetchParticipants();
    fetchMatches();
    loadSavedBracket();
  }, [tournamentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12">
        <div className="text-center">
          <Loader2 className="animate-spin w-16 h-16 text-emerald-600 mx-auto mb-6" />
          <p className="text-xl font-bold text-gray-700">Caricamento tabellone...</p>
        </div>
      </div>
    );
  }

  const totalSlots = 16;
  const slots = Array.from({ length: totalSlots }, (_, i) => bracketSlots[i] || null);

  return (
    <div className="flex min-h-[70vh] bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
      
      {/* Sidebar Iscritti */}
      <div className="bg-gradient-to-b from-emerald-50 to-green-50 shadow-2xl border-r-4 border-emerald-200 w-80 min-h-full">
        <div className="p-8 h-full overflow-y-auto">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b-2 border-emerald-200">
            <Users className="w-8 h-8 text-emerald-600" />
            <h2 className="text-2xl font-black text-gray-900">
              Iscritti ({participants.length})
            </h2>
          </div>
          
          <div className="space-y-3">
            {participants.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-semibold">Nessun partecipante trovato</p>
              </div>
            ) : (
              participants.map((p) => {
                const fullName = `${p.nome} ${p.cognome}`.trim();
                return (
                  <div
                    key={p.id}
                    className="group bg-white p-5 rounded-2xl border-2 border-emerald-200 hover:border-emerald-500 hover:shadow-xl transition-all duration-200 cursor-grab active:cursor-grabbing hover:scale-[1.02] flex flex-col"
                    draggable
                    onDragStart={(e) =>
                      e.dataTransfer.setData("text/plain", JSON.stringify(p))
                    }
                  >
                    <div className="font-bold text-lg text-gray-900 mb-1 truncate">{fullName}</div>
                    <div className="text-sm text-gray-600 truncate">{p.email}</div>
                  </div>
                );
              })
            )}
          </div>

          {/* SALVA & RESET */}
          <div className="p-4 bg-white/80 border-t border-emerald-200 mt-6 space-y-3 sticky bottom-0">
            <button 
              onClick={saveBracket}
              disabled={filledSlotsCount === 0}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-4 px-6 rounded-2xl font-black shadow-xl flex items-center justify-center gap-3 text-lg"
            >
              <Trophy className="w-5 h-5" />
              💾 SALVA ({filledSlotsCount}/16)
            </button>
            
            <button 
              onClick={resetBracket}
              className="w-full bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white py-3 px-6 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
            >
              🔄 RESET
            </button>
          </div>
        </div>
      </div>

      {/* Tabellone 16 Slot */}
      <div className="flex-1 p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-6 py-12">
            {slots.map((player, i) => {
              const nome = player?.nome || '';
              const cognome = player?.cognome || '';
              const initials = nome[0]?.toUpperCase() || `P${i + 1}`;
              
              return (
                <div key={i} className="group relative">
                  <div
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, i)}
                    className="w-28 h-32 md:w-32 md:h-36 bg-gradient-to-br from-white via-blue-50 to-emerald-50 border-3 border-dashed border-emerald-300 hover:border-emerald-500 rounded-2xl flex flex-col items-center justify-center shadow-xl p-3"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-slate-200 to-gray-300 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                      <span className="text-xl md:text-2xl font-black text-gray-700">{initials}</span>
                    </div>
                    <span className="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wider text-center px-1">
                      {player ? `${nome} ${cognome}`.trim() : `Slot ${i + 1}`}
                    </span>
                    {player && (
                      <button
                        onClick={() => removePlayerFromSlot(i)}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-2xl flex items-center justify-center text-sm font-bold shadow-lg"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
