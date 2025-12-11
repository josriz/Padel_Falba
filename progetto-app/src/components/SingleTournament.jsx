import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, Loader2, Users } from 'lucide-react';
import { supabase } from '../supabaseClient';

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
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log('🚀 MOUNTED ID:', tournamentId);
    const loadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        console.log('👤 USER:', user?.email);

        const { data: tournamentData, error } = await supabase
          .from('tournaments')
          .select('*')
          .eq('id', tournamentId)
          .single();
          
        if (error) throw error;
        setTournament(tournamentData);
        console.log('✅ TORNO:', tournamentData.name);

        const { count } = await supabase
          .from('tournament_registrations')
          .select('*', { count: 'exact', head: true })
          .eq('tournament_id', tournamentId);
        
        setParticipantsCount(count || 0);
        console.log('📊 ISCRITTI:', count);

        if (user?.id) {
          const { count: userCount } = await supabase
            .from('tournament_registrations')
            .select('*', { count: 'exact', head: true })
            .eq('tournament_id', tournamentId)
            .eq('user_id', user.id);
          setIsUserRegistered(userCount > 0);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('❌', err);
        setError(err.message);
        setLoading(false);
      }
    };
    if (tournamentId) loadData();
  }, [tournamentId]);

  const handleSignup = async () => {
  console.log('🟢 VERDE CLICCATO!', { 
    user: user?.id, 
    isUserRegistered, 
    tournamentId,
    participantsCount 
  });
  
  if (!user?.id) {
    console.log('❌ NO USER');
    setMessage({ type: 'error', text: '❌ Devi fare login!' });
    return;
  }
  
  console.log('✅ USER OK, controllo iscrizione...');
  
  if (isUserRegistered) {
    console.log('❌ GIA ISCRITTO');
    setMessage({ type: 'error', text: '✅ Già iscritto!' });
    return;
  }
  
  console.log('🚀 TENTATIVO ISCRIZIONE...');
  setSignupLoading(true);
  setMessage(null);
  
  try {
    const { data, error } = await supabase.from('tournament_registrations').insert({
      tournament_id: tournamentId,
      user_id: user.id
    }).select();
    
    if (error) {
      console.error('❌ INSERT ERROR:', error);
      throw error;
    }
    
    console.log('✅ ISCRIZIONE OK!', data);
    setMessage({ type: 'success', text: `✅ Iscritto! ID: ${data[0].id}` });
    setIsUserRegistered(true);
    setParticipantsCount(participantsCount + 1);
    
  } catch (err) {
    console.error('💥 ERRORE COMPLETO:', err);
    setMessage({ type: 'error', text: `❌ ${err.message}` });
  } finally {
    setSignupLoading(false);
  }
};


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8 bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !tournament) {
    return (
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
  }

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
            🏆 Tabellone Semplice
          </Link>
        </div>
      </div>

      {/* TEST + ISCRIZIONE */}
      <div className="max-w-2xl mx-auto mb-16">
        <div className="bg-red-50 p-6 rounded-3xl border-4 border-red-200 mb-6">
          <h3 className="text-xl font-bold text-red-800 mb-4 text-center">🔴 TEST CLICK</h3>
         <button
  onClick={() => {
    console.log('🟢 VERDE FORZATO!');
    handleSignup();
  }}
  className="w-full py-6 px-8 text-xl font-black rounded-3xl shadow-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white flex items-center justify-center gap-4"
>
  🟢 TEST ISCRIZIONE FORZATA
</button>
 <button
            onClick={() => {
              console.log('🔥 CLICK:', { user: user?.email, id: tournamentId, count: participantsCount });
              alert(`User: ${user?.email || 'NULL'}\nID: ${tournamentId}\nIscritti: ${participantsCount}\nRegistrato: ${isUserRegistered}`);
            }}
            className="w-full py-4 px-6 bg-red-500 text-white font-bold rounded-2xl shadow-lg hover:bg-red-600 transition-all flex items-center justify-center gap-3 text-lg mb-3"
          >
            TEST DEBUG (F12)
          </button>
          <p className="text-xs text-red-700 text-center">
            User: {user?.email || 'NULL'} | ID: {tournamentId} | Count: {participantsCount}
          </p>
        </div>

        <div className="bg-emerald-50 p-6 rounded-3xl border-4 border-emerald-200">
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
      </div>

      {/* SEZIONI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        <section className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-blue-100">
          <h2 className="text-3xl font-black mb-8 text-center text-blue-700">
            👥 ISCRITTI ({participantsCount}/{tournament.max_players || 16})
          </h2>
          <div className="text-center py-12 text-gray-500">
            <p className="text-xl mb-6">{participantsCount} / {tournament.max_players || 16} disponibili</p>
            <p className="text-lg font-bold text-emerald-600">✅ FUNZIONA!</p>
          </div>
        </section>
        <section className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-green-100">
          <h2 className="text-3xl font-black mb-8 text-center text-green-700">🏆 TABELLONE</h2>
          <div className="text-center py-12 text-gray-400">
            <p>📋 Tabellone pronto quando ci sono iscritti</p>
            <p className="text-sm mt-2">({participantsCount} / {tournament.max_players || 16})</p>
          </div>
        </section>
      </div>
    </div>
  );
}
