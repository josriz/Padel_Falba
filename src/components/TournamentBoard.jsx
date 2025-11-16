import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient'; // Assicurati che supabaseClient.js sia configurato

export default function TournamentBoard({ torneoId }) {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    async function fetchMatches() {
      const { data, error } = await supabase
        .from('tournament_matches')
        .select(`
          id, round_number, match_index, score_a, score_b, winner_id,
          player_a: tournament_players!tournament_matches_player_a_id_fkey(id, name, surname),
          player_b: tournament_players!tournament_matches_player_b_id_fkey(id, name, surname)
        `)
        .eq('torneo_id', torneoId);

      if (error) {
        console.error('Errore caricando i match:', error);
      } else {
        setMatches(data);
      }
    }
    fetchMatches();
  }, [torneoId]);

  return (
    <div>
      <h2>Tabellone Torneo</h2>
      {matches.length === 0 && <p>Nessun match disponibile</p>}
      {matches.map((match) => (
        <div key={match.id}>
          Round: {match.round_number}, Match: {match.match_index} <br />
          Giocatore A: {match.player_a ? `${match.player_a.name} ${match.player_a.surname}` : 'Nessuno'} <br />
          Giocatore B: {match.player_b ? `${match.player_b.name} ${match.player_b.surname}` : 'Nessuno'} <br />
          Punteggio: {match.score_a ?? '-'} - {match.score_b ?? '-'} <br />
        </div>
      ))}
    </div>
  );
}
