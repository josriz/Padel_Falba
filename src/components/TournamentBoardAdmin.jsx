// src/components/TournamentBoardAdmin.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import TournamentBracket from './TournamentBracket';

export default function TournamentBoardAdmin({ tournamentId }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tournamentId) return;

    const fetchMatches = async () => {
      try {
        const { data, error } = await supabase
          .from('tournament_matches')
          .select('*')
          .eq('tournament_id', tournamentId)
          .order('round_number', { ascending: true })
          .order('match_index', { ascending: true });

        if (error) throw error;
        setMatches(data || []);
      } catch (err) {
        console.error('Errore caricamento match:', err.message || err);
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [tournamentId]);

  if (!tournamentId) return (
    <div className="min-h-screen flex items-center justify-center bg-white p-8">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Seleziona un torneo</h2>
        <p className="text-gray-600">Scegli un torneo per visualizzare il tabellone</p>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-400 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Caricamento tabellone...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-white p-8">
      <div className="text-center max-w-md bg-red-50 border border-red-200 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-red-800 mb-4">Errore caricamento</h2>
        <p className="text-red-700 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-white text-red-700 font-semibold rounded-xl border border-red-200 hover:bg-red-50 transition"
        >
          Riprova
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Tabellone Torneo</h2>
          <p className="text-xl text-gray-600">Gestione completa partite e risultati</p>
        </div>
        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
          <TournamentBracket matches={matches} />
        </div>
      </div>
    </div>
  );
}
