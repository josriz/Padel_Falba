// src/components/TournamentViewOnly.jsx - ✅ LAYOUT DASHBOARD COMPATTO
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Users, Plus, CheckCircle, Loader2, Calendar } from 'lucide-react';

export default function TournamentViewOnly() {
  const [tournaments, setTournaments] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState({});
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

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
      
      if (tournamentsError) {
        console.error('Tournaments error:', tournamentsError);
        setFetchError(tournamentsError.message);
        setLoading(false);
        return;
      }
      
      setTournaments(tournamentsData || []);

      try {
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
      } catch (regError) {
        console.warn('Iscrizioni skip:', regError);
      }
    } catch (error) {
      console.error('Fetch generale:', error);
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
        alert('❌ Effettua il login!');
        return;
      }

      const { error } = await supabase
        .from('tournament_registrations')
        .insert({
          tournament_id: Number(tournamentId),
          user_id: user.id
        });
      
      if (error) throw error;
      
      alert('✅ ISCRITTO CON SUCCESSO!');
      fetchData();
      
    } catch (error) {
      console.error('Iscrizione error:', error);
      alert(`❌ Errore: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center py-12 px-6">
        <div className="text-center bg-white p-12 rounded-xl shadow-sm border border-gray-200">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-6 text-blue-600" />
          <p className="text-xl text-gray-600 font-semibold">Caricamento tornei...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-12 px-6">
        <div className="max-w-2xl mx-auto bg-yellow-50 border border-yellow-200 p-8 rounded-xl shadow-sm">
          <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
           ⚠️ Tornei temporaneamente non disponibili
          </h3>
          <p className="text-yellow-700 mb-6">{fetchError}</p>
          <button 
            onClick={fetchData}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl shadow-sm transition-all"
          >
            🔄 Riprova
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 pt-4 pb-12">
      <div className="p-6 max-w-6xl mx-auto space-y-8">
        {/* ✅ HEADER IDENTICO DASHBOARD */}
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-sm border border-gray-200">
            <Calendar className="w-9 h-9 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tornei Disponibili</h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
            ({tournaments.length}) Iscriviti ai tornei padel
          </p>
        </div>

        {tournaments.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
            <Users className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Nessun torneo attivo</h3>
            <p className="text-gray-600">Torna presto per iscriverti!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((t) => (
              <div key={t.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all hover:-translate-y-1 group">
                {/* ✅ HEADER TOURNAMENT COMPATTO */}
                <h3 className="text-lg font-bold text-gray-900 mb-4 line-clamp-2 leading-tight">{t.name}</h3>
                
                {/* ✅ INFO COMPATTE */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-700">{t.max_players || 16} posti</span>
                  </div>
                  
                  <span className={`block w-full px-4 py-2 rounded-xl text-sm font-bold text-center text-white ${
                    t.status === 'completato' ? 'bg-green-600' :
                    t.status === 'in_corso' ? 'bg-yellow-600' : 'bg-blue-600'
                  }`}>
                    {t.status?.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                {/* ✅ BUTTON COMPATTO */}
                {myRegistrations[t.id] ? (
                  <button 
                    disabled 
                    className="w-full py-3 px-4 bg-emerald-100 text-emerald-800 font-bold rounded-xl shadow-sm border border-emerald-200 flex items-center justify-center gap-2 text-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Iscritto ✅
                  </button>
                ) : (
                  <button
                    onClick={() => handleRegister(t.id)}
                    disabled={loading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    Iscriviti
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
