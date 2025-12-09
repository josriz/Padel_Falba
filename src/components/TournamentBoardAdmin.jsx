import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Loader2, CheckCircle } from 'lucide-react';

/**
 * Componente per visualizzare e gestire i match di un torneo (solo admin)
 * @param {string} tournamentId - ID del torneo selezionato
 */
export default function TournamentBoardAdmin({ tournamentId }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch partite
  useEffect(() => {
    if (!tournamentId) return;

    const fetchMatches = async () => {
      setLoading(true);
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
        console.error('Errore caricamento match:', err);
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [tournamentId]);

  const updateWinner = async (matchId, winnerId) => {
    try {
      const { error } = await supabase
        .from('tournament_matches')
        .update({ winner_id: winnerId })
        .eq('id', matchId);
      if (error) throw error;
      // Refresh
      setMatches(matches.map(m => m.id === matchId ? { ...m, winner_id: winnerId } : m));
    } catch (err) {
      alert('Errore aggiornamento vincitore: ' + err.message);
    }
  };

  if (!tournamentId) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-2">Seleziona un torneo</h2>
        <p>Per visualizzare e gestire il tabellone</p>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-red-50 border border-red-200 p-8 rounded-xl text-red-800 text-center">
        <h2 className="text-xl font-bold mb-2">Errore caricamento</h2>
        <p>{error}</p>
      </div>
    </div>
  );

  if (matches.length === 0) return (
    <div className="text-center py-20">Nessuna partita trovata</div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Tabellone Torneo</h2>
        <div className="grid grid-cols-4 gap-6">
          {matches.map((match) => (
            <div key={match.id} className="bg-white p-4 rounded-xl shadow-md border">
              <h3 className="font-bold mb-2">Round {match.round_number} - Match {match.match_index}</h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => updateWinner(match.id, match.player1_id)}
                  className={`p-2 rounded ${match.winner_id === match.player1_id ? 'bg-green-500 text-white' : 'bg-gray-100'}`}
                >
                  {match.player1_name || 'Player 1'}
                  {match.winner_id === match.player1_id && <CheckCircle className="inline ml-2" />}
                </button>
                <button
                  onClick={() => updateWinner(match.id, match.player2_id)}
                  className={`p-2 rounded ${match.winner_id === match.player2_id ? 'bg-green-500 text-white' : 'bg-gray-100'}`}
                >
                  {match.player2_name || 'Player 2'}
                  {match.winner_id === match.player2_id && <CheckCircle className="inline ml-2" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
