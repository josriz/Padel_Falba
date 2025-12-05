import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../supabaseClient';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function SingleTournament() {
  const { tournamentId } = useParams();
  const { isAdmin, userId } = useAuth();
  const [tournament, setTournament] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!uuidRegex.test(tournamentId)) {
      setError('Identificativo torneo non valido.');
      setLoading(false);
      return;
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournamentId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: tournamentData, error: tournamentErr } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', tournamentId)
        .single();
      if (tournamentErr) throw tournamentErr;
      setTournament(tournamentData);

      const { data: regData, error: regErr } = await supabase
        .from('tournament_registrations')
        .select('*, profiles!inner(nome, cognome, email)')
        .eq('tournament_id', tournamentId);
      if (regErr) throw regErr;
      setRegistrations(regData || []);
    } catch (err) {
      setError('Errore durante il caricamento: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>⏳ Caricamento...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h1>{tournament?.nome}</h1>
      <ul>
        {registrations.map((reg) => (
          <li key={reg.id}>
            {isAdmin
              ? `${reg.profiles?.nome} ${reg.profiles?.cognome} (${reg.profiles?.email})`
              : reg.profiles?.nome}
          </li>
        ))}
      </ul>
    </div>
  );
}
