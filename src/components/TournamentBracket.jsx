import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function TournamentBracket({ torneoId }) {
  const [bracket, setBracket] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBracket() {
      try {
        const { data, error } = await supabase
          .from('tournament_bracket')
          .select('*')
          .eq('tournament_id', torneoId)
          .order('round', { ascending: true });
        if (error) throw error;
        setBracket(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (torneoId) fetchBracket();
  }, [torneoId]);

  if (loading) return <div>Caricamento tabellone...</div>;
  if (error) return <div className="text-red-600">Errore: {error}</div>;
  if (!bracket.length) return <div>Tabellone non disponibile per questo torneo.</div>;

  return (
    <div>
      <h3>Tabellone torneo</h3>
      <ul>
        {bracket.map(match => (
          <li key={match.id}>
            Round {match.round}: {match.player1} vs {match.player2} - Risultato: {match.score}
          </li>
        ))}
      </ul>
    </div>
  );
}
