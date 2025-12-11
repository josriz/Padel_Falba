// src/components/TournamentViewOnly.jsx - Versione Layout Pulita con Indietro + Vai al Tabellone + Aggiornamento iscritti
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Users, Plus, CheckCircle, Loader2, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
// import { triggerParticipantsRefresh } from './TournamentBracket'; // 🔹 Temporaneamente commentato

export default function TournamentViewOnly() {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState({});
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const { data: tournamentsData, error: tournamentsError } = await supabase
        .from('tournaments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (tournamentsError) throw tournamentsError;
      setTournaments(tournamentsData || []);

      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.id) {
        const { data: myRegs } = await supabase
          .from('tournament_registrations')
          .select('tournament_id')
          .eq('user_id', user.id);
        const regsMap = {};
        myRegs?.forEach(reg => regsMap[reg.tournament_id] = true);
        setMyRegistrations(regsMap);
      }
    } catch (error) {
      setFetchError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (tournamentId) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMessage({ type: 'error', text: '❌ Effettua il login!' });
        return;
      }

      const { error } = await supabase
        .from('tournament_registrations')
        .insert({
          tournament_id: Number(tournamentId),
          user_id: user.id
        });
      
      if (error) throw error;
      setMessage({ type: 'success', text: '✅ Iscritto con successo!' });

      // 🔹 Aggiorna automaticamente la lista partecipanti del tabellone
      // if (typeof triggerParticipantsRefresh === 'function') {
      //   triggerParticipantsRefresh();
      // }

      fetchData();
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Errore: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin w-12 h-12 text-gray-700" />
      </div>
    );

  if (fetchError)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-red-600">
        {fetchError}
      </div>
    );

  return (
    <div className="min-h-screen bg-white pt-4 pb-12">
      <div className="p-6 max-w-6xl mx-auto space-y-8">

        {/* BOTTONE INDietro */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-xl font-bold"
          >
            ← Indietro
          </button>
        </div>

        {/* HEADER PULITO */}
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-sm border border-gray-200">
            <Calendar className="w-9 h-9 text-gray-700" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tornei Disponibili</h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            ({tournaments.length}) Tornei attivi
          </p>
        </div>

        {/* MESSAGE */}
        {message && (
          <div
            className={`p-4 rounded-xl mb-4 flex items-start gap-3 shadow-sm border ${
              message.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            <CheckCircle className="w-5 h-5 mt-0.5" />
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        {/* LISTA TORNEI */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map(t => (
            <div
              key={t.id}
              className="bg-white p-6 rounded-xl shadow border border-gray-200 flex flex-col gap-3"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">{t.name}</h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-xl border border-gray-200">
                  <Users className="w-4 h-4 text-gray-700" />
                  <span className="text-sm font-semibold text-gray-700">
                    {t.max_players || 16} posti • €{t.price || 0}
                  </span>
                </div>

                <span
                  className="block w-full px-4 py-2 rounded-xl text-sm font-bold text-center text-white bg-gray-700"
                >
                  {t.status}
                </span>
              </div>

              {/* BOTTONE ISCRIZIONE */}
              <button
                disabled={myRegistrations[t.id]}
                onClick={() => handleRegister(t.id)}
                className={`w-full py-3 px-6 font-bold rounded-xl text-white flex items-center justify-center gap-2 text-sm transition-all ${
                  myRegistrations[t.id]
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gray-800 hover:bg-gray-900'
                }`}
              >
                <Plus className="w-4 h-4" />
                {myRegistrations[t.id] ? 'Già iscritto' : 'Iscriviti'}
              </button>

              {/* BOTTONE VAI AL TABELLONE */}
              <button
                onClick={() => navigate(`/tabellone-demo`)}
                className="w-full mt-2 py-3 px-6 font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700"
              >
                🏆 Vai al Tabellone
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
