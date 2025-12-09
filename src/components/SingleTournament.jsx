import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../supabaseClient';
import TournamentPlayers from './TournamentPlayers';
import TournamentBracket from './TournamentBracket';
import TournamentBracketEditable from './TournamentBracketEditable';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function SingleTournament() {
  const { tournamentId } = useParams();
  const { isAdmin, userId } = useAuth();
  const [tournament, setTournament] = useState(null);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [bracketSlots, setBracketSlots] = useState(Array(32).fill(null));  // ✅ SHARED STATE
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!uuidRegex.test(tournamentId)) {
      setError('Identificativo torneo non valido.');
      setLoading(false);
      return;
    }
    console.log('✅ SingleTournament ID:', tournamentId);
    fetchData();
  }, [tournamentId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const { data: tournamentData, error: tournamentErr } = await supabase
        .from('tournaments')
        .select('id, name, status, max_players, data_inizio')
        .eq('id', tournamentId)
        .single();
      if (tournamentErr) throw tournamentErr;
      setTournament(tournamentData);
      console.log('✅ Torneo:', tournamentData.name);

      const { count: participantsCount, error: countErr } = await supabase
        .from('tournament_participants')
        .select('*', { count: 'exact', head: true })
        .eq('tournament_id', tournamentId);
      if (countErr) {
        console.error('❌ Participants count:', countErr);
      } else {
        console.log('✅ Partecipanti:', participantsCount);
      }
      setParticipantsCount(participantsCount || 0);

    } catch (err) {
      console.error('❌ fetchData:', err);
      setError('Errore caricamento: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="text-red-600 p-8 text-center min-h-screen flex items-center">
        {error || 'Torneo non trovato'}
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      {/* HEADER + 3 BOTTONI */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
          {tournament.name}
        </h1>
        <p className="text-2xl text-gray-600 mb-10">
          👥 <strong>{participantsCount}</strong> iscritti / {tournament.max_players || 'N/D'} 
          | 🏆 Slot occupati: <strong>{bracketSlots.filter(Boolean).length}</strong>/32
        </p>
        
        <div className="flex flex-wrap gap-6 justify-center max-w-3xl mx-auto">
          <Link 
            to={`/tournaments/${tournamentId}/players`} 
            className="px-8 py-4 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 flex-1 min-w-[220px] font-bold text-lg shadow-2xl hover:shadow-3xl transition-all"
          >
            👥 Gestione Iscritti ({participantsCount})
          </Link>
          <Link 
            to={`/tournaments/${tournamentId}/bracket`} 
            className="px-8 py-4 bg-green-500 text-white rounded-2xl hover:bg-green-600 flex-1 min-w-[220px] font-bold text-lg shadow-2xl hover:shadow-3xl transition-all"
          >
            🏆 Tabellone Semplice
          </Link>
          {isAdmin && (
            <Link 
              to={`/tournaments/${tournamentId}/board`} 
              className="px-8 py-4 bg-purple-500 text-white rounded-2xl hover:bg-purple-600 flex-1 min-w-[220px] font-bold text-lg shadow-2xl hover:shadow-3xl transition-all"
            >
              🎾 COPPA ITALIA ADMIN
            </Link>
          )}
        </div>
      </div>

      {/* Players + Bracket Semplice */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        <section className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-blue-100">
          <h2 className="text-3xl font-black mb-8 text-center text-blue-700">👥 ISCRITTI DISPONIBILI</h2>
          <TournamentPlayers 
            tournamentId={tournamentId} 
            bracketSlots={bracketSlots} 
            setBracketSlots={setBracketSlots} 
          />
        </section>
        <section className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-green-100">
          <h2 className="text-3xl font-black mb-8 text-center text-green-700">🏆 SLOT TABELLONE</h2>
          <TournamentBracket 
            tournamentId={tournamentId} 
            bracketSlots={bracketSlots} 
            setBracketSlots={setBracketSlots} 
          />
        </section>
      </div>

      {/* ✅ TABELLONE COPPA ITALIA - SOLO ADMIN */}
      {isAdmin && (
        <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-12 rounded-3xl shadow-2xl col-span-full border-4 border-purple-200">
          <h2 className="text-4xl font-black mb-12 text-center bg-gradient-to-r from-purple-800 via-pink-800 to-blue-800 bg-clip-text text-transparent">
            🎾 TABELLONE COMPLETO - COPPA PADEL
          </h2>
          <TournamentBracketEditable 
            tournamentId={tournamentId} 
            bracketSlots={bracketSlots} 
          />
        </section>
      )}
    </div>
  );
}
