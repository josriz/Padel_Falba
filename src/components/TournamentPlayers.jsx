// src/components/TournamentPlayers.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Users, Loader2, User as UserIcon } from 'lucide-react';

export default function TournamentPlayers({ tournamentId }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tournamentId) return;

    const fetchPlayers = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('🔍 Caricando torneo ID:', tournamentId);

        // ✅ Query aggiornata: join su public_users
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
      } catch (err) {
        console.error('❌ ERRORE:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [tournamentId]);

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
    <div className="space-y-3 p-6 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-sm border border-blue-100">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-blue-100">
        <div className="flex items-center gap-3">
          <Users className="w-7 h-7 text-blue-600" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">Tabellone Iscritti</h3>
            <p className="text-sm text-blue-700 font-medium">{players.length} giocatore/i</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {players.map((p) => {
          const user = p.public_users || {};
          const displayName = (user.name || '') + ' ' + (user.surname || '');
          const nameTrimmed = displayName.trim() || user.email || 'N/D';

          return (
            <div key={p.id} className="group flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm rounded-xl hover:bg-white hover:shadow-md transition-all border border-gray-100 hover:border-blue-200 hover:-translate-y-0.5">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-white/50">
                  <span className="text-white font-bold text-xl drop-shadow-md">
                    {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-gray-900 truncate" title={nameTrimmed}>
                    {nameTrimmed}
                  </div>
                  <div className="text-sm text-gray-600 truncate" title={user.email}>
                    {user.email}
                  </div>
                  {user.phone && (
                    <div className="text-xs text-gray-500 mt-0.5">📱 {user.phone}</div>
                  )}
                  {user.is_super_admin && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full mt-1 inline-block">
                      ADMIN
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right ml-4">
                <div className="text-xs text-gray-500">Iscritto il</div>
                <div className="font-mono text-sm font-semibold text-gray-900">
                  {new Date(p.created_at).toLocaleDateString('it-IT')}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
