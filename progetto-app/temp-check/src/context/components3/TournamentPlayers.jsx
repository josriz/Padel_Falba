import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Users, Loader2, User as UserIcon } from 'lucide-react';

export default function TournamentPlayers({ tournamentId }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tournamentId) {
      setPlayers([]);
      setLoading(false);
      return;
    }

    const fetchPlayers = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('tournament_players')
          .select(`
            id,
            player_id,
            user_id,
            users!user_id (
              id,
              email,
              name,
              fullName,
              avatar_url
            )
          `)
          .eq('tournament_id', tournamentId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setPlayers(data || []);
      } catch (err) {
        setError(err.message || 'Errore nel caricamento dei giocatori');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [tournamentId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-4 text-gray-600">
        <Loader2 className="w-4 h-4 animate-spin" />
        Caricamento giocatori...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
        {error}
      </div>
    );
  }

  if (!players.length) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500 bg-gray-50 rounded-2xl">
        <Users className="w-8 h-8 mr-2 opacity-50" />
        <span>Nessun giocatore iscritto</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-lg text-gray-900">Giocatori iscritti ({players.length})</h3>
      </div>

      <div className="grid gap-2 max-h-64 overflow-y-auto p-2 bg-gray-50 rounded-xl">
        {players.map((player) => {
          const user = player.users || {};
          const displayName = user.fullName || user.name || user.email || 'Utente anonimo';

          return (
            <div key={player.id} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={displayName} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-white" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">{displayName}</p>
                {user.email && <p className="text-xs text-gray-500 truncate">{user.email}</p>}
              </div>

              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Iscritto</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
