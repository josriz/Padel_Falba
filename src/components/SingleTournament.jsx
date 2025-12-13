// src/pages/SingleTournament.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, Loader2, Users } from 'lucide-react';
import { supabase } from '../supabaseClient';
import TournamentBracket from '../components/TournamentBracket';

export default function SingleTournament() {
  const { tournamentId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tournament, setTournament] = useState(null);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1️⃣ Recupera utente
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        // 2️⃣ Recupera torneo
        const { data: tournamentData, error: tournamentError } = await supabase
          .from('tournaments')
          .select('*')
          .eq('id', tournamentId)
          .single();
        if (tournamentError) throw tournamentError;
        setTournament(tournamentData);

        // 3️⃣ Conteggio partecipanti da più tabelle
        const tables = ['tournament_registrations', 'tournament_players', 'tournament_participants'];
        let totalCount = 0;
        for (const table of tables) {
          const { data } = await supabase
            .from(table)
            .select('id')
            .eq('tournament_id', tournamentId);
          totalCount += data?.length || 0;
        }
        setParticipantsCount(totalCount);

        // 4️⃣ Verifica iscrizione utente
        if (user?.id) {
          const { data: userRegs } = await supabase
            .from('tournament_registrations')
            .select('id')
            .eq('tournament_id', tournamentId)
            .eq('user_id', user.id);
          setIsUserRegistered(userRegs?.length > 0);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (tournamentId) loadData();
  }, [tournamentId]);

  const handleSignup = async () => {
    if (!user?.id) {
      setMessage({ type: 'error', text: '❌ Devi fare login!' });
      return;
    }
    if (isUserRegistered) {
      setMessage({ type: 'error', text: '✅ Già iscritto!' });
      return;
    }

    setSignupLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase
        .from('tournament_registrations')
        .insert({ tournament_id: tournamentId, user_id: user.id })
        .select();
      if (error) throw error;

      setMessage({ type: 'success', text: `✅ Iscritto! ID: ${data[0].id}` });
      setIsUserRegistered(true);
      setParticipantsCount(prev => prev + 1);
    } catch (err) {
      setMessage({ type: 'error', text: `❌ ${err.message}` });
    } finally {
      setSignupLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen p-8 bg-gradient-to-br from-emerald-50 to-blue-50">
      <Loader2 className="w-16 h-16 animate-spin text-emerald-500" />
    </div>
  );

  if (error || !tournament) return (
    <div className="text-red-600 p-8 text-center min-h-screen flex items-center bg-gradient-to-br from-emerald-50 to-blue-50">
      <div className="max-w-md">
        <AlertCircle className="w-24 h-24 mx-auto mb-6 opacity-50" />
        <h1 className="text-3xl font-bold mb-4">{error || 'Torneo non trovato'}</h1>
        <Link to="/tournaments" className="px-8 py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all inline-flex items-center gap-2">
          ← Torna ai Tornei
        </Link>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      {/* HEADER */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
          {tournament.name}
        </h1>
        <p className="text-2xl text-gray-600 mb-10">
          👥 <strong>{participantsCount}</strong> / {tournament.max_players || 16} iscritti 
          | 💰 {tournament.price ? `€${tournament.price}` : 'Gratis'}
          | 📅 {tournament.date ? new Date(tournament.date).toLocaleDateString('it-IT') : 'TBD'}
        </p>
        <div className="flex flex-wrap gap-6 justify-center max-w-3xl mx-auto">
          <Link to={`/tournaments/${tournamentId}/players`} className="px-8 py-4 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 flex-1 min-w-[220px] font-bold text-lg shadow-2xl hover:shadow-3xl transition-all">
            👥 Gestione Iscritti ({participantsCount})
          </Link>
          <Link to={`/tournaments/${tournamentId}/bracket`} className="px-8 py-4 bg-green-500 text-white rounded-2xl hover:bg-green-600 flex-1 min-w-[220px] font-bold text-lg shadow-2xl hover:shadow-3xl transition-all">
            🏆 Tabellone Drag & Drop
          </Link>
        </div>
      </div>

      {/* ISCRIZIONE */}
      <div className="max-w-2xl mx-auto mb-16">
        {message && (
          <div className={`p-4 rounded-2xl mb-4 flex items-center gap-3 font-bold ${
            message.type === 'success'
              ? 'bg-emerald-100 border border-emerald-300 text-emerald-800'
              : 'bg-red-100 border border-red-300 text-red-800'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
            <span>{message.text}</span>
          </div>
        )}
        <button
          onClick={handleSignup}
          disabled={signupLoading || isUserRegistered}
          className={`w-full py-6 px-8 text-xl font-black rounded-3xl shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center gap-4 ${
            signupLoading || isUserRegistered
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white'
          }`}
        >
          {signupLoading ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : isUserRegistered ? (
            '✅ ISCRITTO!'
          ) : (
            <>
              <Users className="w-8 h-8" />
              ISCRIVITI ORA
            </>
          )}
        </button>
      </div>

      {/* SEZIONI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        <section className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-blue-100">
          <h2 className="text-3xl font-black mb-8 text-center text-blue-700">
            👥 ISCRITTI ({participantsCount}/{tournament.max_players || 16})
          </h2>
          <div className="text-center py-12 text-gray-500">
            <p className="text-xl mb-6">{participantsCount} / {tournament.max_players || 16} disponibili</p>
            <p className="text-lg font-bold text-emerald-600">✅ Sistema funzionante - RLS disabilitato</p>
            <p className="text-sm mt-4 text-gray-500">📊 Conta reale da 3 tabelle</p>
          </div>
        </section>
        
        <section className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-green-100">
          <h2 className="text-3xl font-black mb-8 text-center text-green-700">🏆 TABELLONE</h2>
          <TournamentBracket tournamentId={tournamentId} />
        </section>
      </div>
    </div>
  );
}
