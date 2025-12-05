import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthProvider';

export default function TournamentRegisterAuth() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTorneo, setSelectedTorneo] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    const { data, error } = await supabase.from('tournaments').select('*');
    if (error) console.error(error);
    else setTournaments(data || []);
    setLoading(false);
  };

  const handleIscrizione = async () => {
    if (!selectedTorneo || !user) {
      alert('❌ Devi fare login e selezionare un torneo!');
      return;
    }

    setRegisterLoading(true);
    try {
      console.log('🔑 UUID:', user.id, 'Torneo:', selectedTorneo);
      
      const { error } = await supabase
        .from('tournament_registrations')
        .insert({ 
          tournament_id: selectedTorneo,
          user_id: user.id  // ✅ CORRETTO - Foreign key OK
        });
      
      if (error) {
        console.error('❌ ERRORE:', error);
        alert('❌ Errore: ' + error.message);
      } else {
        alert('✅ ISCRITTO CON SUCCESSO!');
        setSelectedTorneo('');
        fetchTournaments();
      }
    } catch (err) {
      alert('❌ Errore: ' + err.message);
    } finally {
      setRegisterLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">⏳ Caricamento tornei...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl">
      <h3 className="text-4xl font-black text-center mb-12 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
        🎾 ISCRIZIONE TORNEI
      </h3>
      
      {!user ? (
        <div className="p-8 bg-red-50 border-2 border-red-200 rounded-2xl text-center">
          <p className="text-xl font-bold text-red-800 mb-4">❌ Effettua il login per iscriverti!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* INFO UTENTE */}
          <div className="p-4 bg-green-50 border-2 border-green-200 rounded-2xl">
            <p className="text-lg font-bold text-green-800">👤 {user.email}</p>
          </div>

          {/* SELEZIONE TORNEA */}
          <select 
            value={selectedTorneo} 
            onChange={(e) => setSelectedTorneo(e.target.value)}
            className="w-full p-4 border-2 border-orange-200 rounded-2xl text-xl font-bold focus:ring-4 focus:ring-orange-200"
            disabled={registerLoading}
          >
            <option value="">📋 Seleziona Torneo</option>
            {tournaments.map(t => (
              <option key={t.id} value={t.id}>
                {t.nome} ({t.max_giocatori || t.max_players} max)
              </option>
            ))}
          </select>

          {/* BUTTON ISCRIZIONE */}
          <button 
            onClick={handleIscrizione}
            disabled={!selectedTorneo || registerLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-black py-6 px-8 rounded-3xl text-xl shadow-2xl hover:shadow-3xl hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-2"
          >
            {registerLoading ? (
              <>⏳ ISCRIZIONE IN CORSO...</>
            ) : (
              <>✅ ISCRIVITI ORA</>
            )}
          </button>
        </div>
      )}
      
      <div className="mt-8 p-6 bg-orange-50 rounded-2xl text-center">
        <p className="text-lg font-bold text-orange-800">
          Tornei disponibili: {tournaments.length}
        </p>
      </div>
    </div>
  );
}
