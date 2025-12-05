// src/components/TournamentDetail.jsx - ✅ LAYOUT DASHBOARD COMPATTO
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../supabaseClient';
import { Shield, Users, Calendar, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
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

        const { data: tournamentData, error: tournamentError } = await supabase
          .from('tournaments')
          .select('*')
          .eq('id', tournamentId)
          .single();
        if (tournamentError) throw tournamentError;

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

  if (!tournamentId) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center py-12 px-6">
      <div className="text-center bg-white p-12 rounded-xl shadow-sm border border-gray-200 max-w-md">
        <AlertCircle className="w-20 h-20 text-gray-400 mx-auto mb-6" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Seleziona un torneo</h3>
        <p className="text-gray-600 mb-8">Nessun ID torneo specificato</p>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center py-12 px-6">
      <div className="text-center bg-white p-12 rounded-xl shadow-sm border border-gray-200">
        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-6 text-blue-600" />
        <p className="text-xl text-gray-600 font-semibold">Caricamento torneo...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-12 px-6">
      <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 p-8 rounded-xl shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
          <h3 className="text-xl font-bold text-red-800">Errore caricamento</h3>
        </div>
        <p className="text-red-700 mb-6">{error}</p>
      </div>
    </div>
  );

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
      window.location.reload();
    } catch (err) {
      alert('❌ Errore iscrizione: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 pt-4 pb-12">
      <div className="p-6 max-w-6xl mx-auto space-y-8">
        {/* ✅ HEADER TORNEO COMPATTO */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{tournament.name}</h1>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  Status: 
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    tournament.status === 'completato' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {tournament.status === 'completato' ? '🏁 COMPLETO' : '✅ APERTO'}
                  </span>
                </p>
              </div>
            </div>
            
            {!isAdmin && (
              <button
                onClick={handleRegister}
                disabled={userAlreadyRegistered || isFull || submitting}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center gap-2 text-sm"
              >
                {userAlreadyRegistered ? (
                  <CheckCircle className="w-4 h-4" />
                ) : submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Users className="w-4 h-4" />
                )}
                {userAlreadyRegistered ? 'Già iscritto' : isFull ? 'Completo' : submitting ? 'Iscrizione...' : 'ISCRIVITI'}
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">
                Iscritti: <span className="text-xl font-black">{registrations.length}/{tournament.max_players}</span>
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Calendar className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-900">
                Inizio: {new Date(tournament.start_date).toLocaleDateString('it-IT')}
              </span>
            </div>
          </div>
        </div>

        {/* ✅ TABELLONE */}
        <TournamentBracket matches={matches} />

        {/* ✅ LISTA ISCRITTI ADMIN COMPATTA */}
        {isAdmin && registrations.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Iscritti ({registrations.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Giocatore</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Iscritto il</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((r) => {
                    const user = r.users || {};
                    return (
                      <tr key={r.id || r.user_id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-900">{user.name || user.email || 'N/D'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{user.email || '-'}</td>
                        <td className="px-6 py-4 text-xs text-gray-500">{new Date(r.created_at).toLocaleDateString('it-IT')}</td>
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
