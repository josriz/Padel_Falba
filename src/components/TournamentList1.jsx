import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../supabaseClient';

export default function TournamentList() {
  const { isAdmin } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const { data, error } = await supabase
          .from('tournaments')
          .select('id, nome, max_players, status')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTournaments(data || []);
      } catch (error) {
        console.error('Errore caricamento tornei:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  if (loading) return <div className="text-4xl text-center py-40">⏳ Caricamento...</div>;

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-5xl font-black text-center mb-20 text-gray-800">
          🏆 TORNEI ({tournaments.length})
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tournaments.map((t) => (
            <Link
              key={t.id}
              to={`/torneo/${t.id}`} 
              className="group block bg-white rounded-3xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-200 hover:border-gray-300"
            >
              <div className="bg-gray-100 p-8 text-gray-800 rounded-t-3xl">
                <h2 className="text-3xl font-black mb-2">{t.nome || '—'}</h2>
                <p className="text-lg opacity-90">
                  Max {t.max_players || '—'} | {t.status || '—'}
                </p>
              </div>
              <div className="p-8">
                <div className="w-full flex items-center justify-center gap-3 bg-gray-200 text-gray-800 font-black py-6 px-8 rounded-2xl shadow text-xl group-hover:scale-105 transition-all">
                  {isAdmin ? '👑 ADMIN: TABELLONE' : '🎾 ISCRIVITI'}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {tournaments.length === 0 && (
          <div className="text-center py-40">
            <p className="text-2xl text-gray-500">Nessun torneo trovato</p>
          </div>
        )}
      </div>
    </div>
  );
}
