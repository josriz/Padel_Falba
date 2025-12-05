// src/components/TournamentDetail.jsx - COMPLETO + ADMIN + ISCRIZIONI CORRETTE
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../supabaseClient';
import { Shield, Users, Calendar } from 'lucide-react';
import TournamentBracket from './TournamentBracket';

export default function TournamentDetail() {
  const { userId, isAdmin } = useAuth();
  const { id: tournamentId } = useParams();

  const [tournament, setTournament] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!tournamentId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Torneo
        const { data: tournamentData, error: tournamentError } = await supabase
          .from('tournaments')
          .select('*')
          .eq('id', tournamentId)
          .single();
        if (tournamentError) throw tournamentError;

        // ✅ ISCRITTI CON JOIN public.users (NO nome/cognome)
        const { data: regsData, error: regsError } = await supabase
          .from('tournament_registrations')
          .select(`
            id,
            user_id,
            created_at,
            users (
              id,
              email,
              name
            )
          `)
          .eq('tournament_id', tournamentId)
          .order('created_at');
        if (regsError) throw regsError;

        // Tabellone
        const { data: matchesData, error: matchesError } = await supabase
          .from('matches')
          .select('*')
          .eq('tournament_id', tournamentId)
          .order('round_number');
        if (matchesError) throw matchesError;

        setTournament(tournamentData);
        setRegistrations(regsData || []);
        setMatches(matchesData || []);
      } catch (err) {
        console.error(err);
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tournamentId]);

  if (!tournamentId) return <div className="text-center py-20 text-xl">Seleziona un torneo</div>;
  if (loading) return <div className="text-center py-20 text-2xl flex items-center gap-3 justify-center">⏳ Caricamento...</div>;
  if (error) return <div className="text-center py-20 text-red-600 text-xl">❌ Errore: {error}</div>;

  const isFull = registrations.length >= (tournament.max_players || 0);
  const userAlreadyRegistered = registrations.some(r => r.user_id === userId);

  const handleRegister = async () => {
    if (!userId || userAlreadyRegistered || isFull) return;
    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('tournament_registrations')
        .insert([{ tournament_id: tournamentId, user_id: userId }]);
      if (error) throw error;
      alert('✅ Iscrizione completata!');
      window.location.reload(); // Ricarica per vedere aggiornamento
    } catch (err) {
      alert('❌ Errore iscrizione: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* HEADER TORNEO */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-12">
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <Shield className="w-12 h-12" />
              <div>
                <h1 className="text-4xl font-black">{tournament.name}</h1>
                <p className="opacity-90 text-lg">
                  Status: 
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${tournament.status === 'completato' ? 'bg-red-200 text-red-800' : 'bg-emerald-200 text-emerald-800'}`}>
                    {tournament.status === 'completato' ? '🏁 COMPLETO' : '✅ APERTO'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4 text-emerald-800 font-bold">
                <Users className="w-5 h-5" />
                <span>Iscritti: <span className="text-2xl">{registrations.length}</span>/{tournament.max_players}</span>
              </div>
              <div className="flex items-center gap-3 mb-4 text-blue-800 font-bold">
                <Calendar className="w-5 h-5" />
                <span>Inizio: {new Date(tournament.start_date).toLocaleDateString('it-IT')}</span>
              </div>
            </div>

            <div className="text-right">
              {!isAdmin && (
                <button
                  onClick={handleRegister}
                  disabled={userAlreadyRegistered || isFull || submitting}
                  className="px-6 py-3 rounded-2xl font-bold text-lg bg-emerald-500 text-white hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {userAlreadyRegistered ? '✅ Già iscritto' : isFull ? '🏁 Completo' : submitting ? '⏳ Iscrizione...' : '🎾 ISCRIVITI'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* TABELLONE */}
        <TournamentBracket matches={matches} />

        {/* LISTA ISCRITTI - SOLO ADMIN */}
        {isAdmin && registrations.length > 0 && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mt-12">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <h3 className="text-2xl font-black flex items-center gap-3">
                👥 ISCRITTI ({registrations.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-6 text-left font-black text-lg">Giocatore</th>
                    <th className="p-6 text-left font-black text-lg">Email</th>
                    <th className="p-6 text-left font-black text-lg">Iscritto il</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((r) => {
                    const user = r.users || {};
                    return (
                      <tr key={r.id || r.user_id} className="border-b hover:bg-blue-50">
                        <td className="p-6 font-bold text-xl">{user.name || user.email || 'N/D'}</td>
                        <td className="p-6 font-bold text-xl">{user.email || '-'}</td>
                        <td className="p-6 text-sm text-gray-600">{new Date(r.created_at).toLocaleDateString('it-IT')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
