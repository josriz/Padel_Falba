// src/components/TournamentPlayers.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Users, Loader2 } from "lucide-react";

export default function TournamentPlayers({ tournamentId, bracketSlots, setBracketSlots }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draggedPlayer, setDraggedPlayer] = useState(null);

  useEffect(() => {
    if (!tournamentId) {
      setLoading(false);
      return;
    }

    const fetchPlayers = async () => {
      setLoading(true);
      setError(null);
      try {
        // ✅ MULTI-TABELLA: Prova tutte le tabelle possibili
        const tables = ['tournament_registrations', 'tournament_participants', 'tournament_players'];
        let allPlayers = [];
        
        for (const table of tables) {
          try {
            const { data, error: tableError } = await supabase
              .from(table)
              .select('id, nome, cognome, email, user_id, name, surname')
              .eq('tournament_id', tournamentId)
              .order('id');
            
            if (tableError) {
              console.log(`❌ ${table}:`, tableError.message);
            } else {
              console.log(`✅ ${table}: ${data?.length || 0} giocatori`);
              allPlayers = [...allPlayers, ...(data || [])];
            }
          } catch (e) {
            console.log(`❌ Tabella ${table} non esiste`);
          }
        }
        
        // Rimuovi duplicati per ID
        const uniquePlayers = allPlayers.filter((player, index, self) => 
          index === self.findIndex(p => p.id === player.id)
        );
        
        setPlayers(uniquePlayers);
        console.log('✅ TOTALE GIOCATORI CARICATI:', uniquePlayers.length);
        
      } catch (err) {
        setError(err.message);
        console.error('❌ fetchPlayers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [tournamentId]);

  const handleDragStart = (e, player) => {
    setDraggedPlayer(player);
    e.dataTransfer.setData('text/plain', JSON.stringify(player));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 p-8 text-gray-600">
        <Loader2 className="w-5 h-5 animate-spin" />
        Caricamento giocatori...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-800 text-center">
        <Users className="w-8 h-8 mx-auto mb-2 opacity-75" />
        <div>Errore: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3 p-6 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl shadow-sm border border-emerald-100">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-emerald-100">
          <div className="flex items-center gap-3">
            <Users className="w-7 h-7 text-emerald-600" />
            <div>
              <h3 className="text-xl font-bold text-gray-900">👥 Iscritti Disponibili ({players.length})</h3>
              <p className="text-sm text-emerald-700 font-medium">Trascina nei slot del tabellone</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-80 overflow-y-auto p-2">
          {players.map((p) => {
            const nome = p.nome || p.name || 'N/D';
            const cognome = p.cognome || p.surname || '';
            const fullName = `${nome} ${cognome}`.trim();
            const email = p.email || 'N/D';
            
            return (
              <div 
                key={p.id}
                className="group p-6 bg-white border-2 border-emerald-300 rounded-2xl hover:shadow-2xl hover:border-emerald-500 hover:bg-emerald-50 transition-all cursor-grab active:cursor-grabbing hover:scale-[1.02] min-w-[260px]"
                style={{ minHeight: '120px' }}
                draggable="true"
                onDragStart={(e) => handleDragStart(e, p)}
              >
                <div className="flex items-start gap-4 h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-2xl">{nome[0]?.toUpperCase()}</span>
                  </div>
                  <div className="flex-1 py-2 min-w-0">
                    <div className="font-bold text-lg text-gray-900 mb-2 whitespace-normal break-words leading-tight" title={fullName}>
                      {fullName}
                    </div>
                    <div className="text-sm text-gray-600 whitespace-normal break-words bg-gray-50 px-2 py-1 rounded">
                      {email}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!players.length && (
        <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <div className="text-lg font-medium">Nessun giocatore iscritto</div>
          <div className="text-sm mt-1">Invita i giocatori a iscriversi!</div>
        </div>
      )}
    </div>
  );
}
