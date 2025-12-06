// src/components/TournamentPlayers.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Users, Loader2, User as UserIcon } from 'lucide-react';

export default function TournamentPlayers({ tournamentId }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // 🔧 AGGIUNTO: stati per drag&drop
  const [bracketSlots, setBracketSlots] = useState(Array(32).fill(null));
  const [draggedPlayer, setDraggedPlayer] = useState(null);

  useEffect(() => {
    if (!tournamentId) return;

    const fetchPlayers = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('🔍 Caricando torneo ID:', tournamentId);

        const { data, error } = await supabase
          .from('tournament_registrations')
          .select(`
            id,
            user_id,
            created_at,
            public_users (
              id,
              email,
              name,
              surname,
              phone,
              is_super_admin
            )
          `)
          .eq('tournament_id', tournamentId)
          .order('created_at');

        if (error) throw error;

        console.log('✅ GIOCATORI:', data);
        setPlayers(data || []);
        
        // 🔧 AGGIUNTO: carica slot tabellone esistenti
        const { data: slots } = await supabase
          .from('tournament_bracket')
          .select('slot_index, public_users(name, surname)')
          .eq('tournament_id', tournamentId);
        
        const slotsArray = Array(32).fill(null);
        slots?.forEach(slot => {
          slotsArray[slot.slot_index] = slot.public_users;
        });
        setBracketSlots(slotsArray);
      } catch (err) {
        console.error('❌ ERRORE:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [tournamentId]);

  // 🔧 AGGIUNTO: drag handlers
  const handleDragStart = (e, player) => {
    setDraggedPlayer(player);
    e.dataTransfer.setData('text/plain', JSON.stringify(player));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, slotIndex) => {
    e.preventDefault();
    if (!draggedPlayer) return;

    const newSlots = [...bracketSlots];
    newSlots[slotIndex] = draggedPlayer.public_users;
    setBracketSlots(newSlots);

    // Salva in Supabase
    await supabase.from('tournament_bracket').upsert([{
      tournament_id: tournamentId,
      slot_index: slotIndex,
      user_id: draggedPlayer.user_id,
      updated_at: new Date().toISOString()
    }]);

    setDraggedPlayer(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 p-8 text-gray-600">
        <Loader2 className="w-5 h-5 animate-spin" />
        Caricamento tabellone...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-800 text-center">
        <UserIcon className="w-8 h-8 mx-auto mb-2 opacity-75" />
        <div>{error}</div>
      </div>
    );
  }

  if (!players.length) {
    return (
      <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <div className="text-lg">Nessun giocatore iscritto</div>
        <div className="text-sm mt-1">Invita i giocatori a iscriversi!</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 🔧 AGGIUNTO: Sezione Iscritti (Drag) */}
      <div className="space-y-3 p-6 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl shadow-sm border border-emerald-100">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-emerald-100">
          <div className="flex items-center gap-3">
            <Users className="w-7 h-7 text-emerald-600" />
            <div>
              <h3 className="text-xl font-bold text-gray-900">👥 Iscritti Disponibili (Trascina)</h3>
              <p className="text-sm text-emerald-700 font-medium">{players.length} giocatore/i</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-64 overflow-y-auto">
          {players.map((p) => {
            const user = p.public_users || {};
            const displayName = (user.name || '') + ' ' + (user.surname || '');
            const nameTrimmed = displayName.trim() || user.email || 'N/D';

            return (
              <div 
                key={p.id}
                className="group p-4 bg-white/70 backdrop-blur-sm rounded-xl hover:bg-white hover:shadow-md transition-all border-2 border-dashed border-emerald-200 hover:border-emerald-400 cursor-grab active:cursor-grabbing hover:scale-105"
                draggable="true"
                onDragStart={(e) => handleDragStart(e, p)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-gray-900 truncate" title={nameTrimmed}>
                      {nameTrimmed}
                    </div>
                    <div className="text-xs text-gray-600 truncate">{user.email}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🔧 AGGIUNTO: Slot Tabellone (Drop) */}
      <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-sm border border-indigo-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          🏆 Slot Tabellone (Rilascia qui)
        </h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {bracketSlots.map((slot, index) => (
            <div
              key={index}
              className={`p-3 rounded-xl border-2 transition-all min-h-[70px] flex items-center justify-center text-sm font-medium text-gray-600 ${
                slot 
                  ? 'bg-emerald-100 border-emerald-400 shadow-md' 
                  : 'bg-white/50 border-dashed border-indigo-300 hover:border-indigo-400 hover:bg-indigo-50'
              }`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              {slot ? (
                <div className="text-center">
                  <div className="font-bold text-emerald-700 mb-1">
                    {slot.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="text-xs truncate">
                    {slot.name} {slot.surname}
                  </div>
                </div>
              ) : (
                <span>Rilascia Slot {index + 1}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
