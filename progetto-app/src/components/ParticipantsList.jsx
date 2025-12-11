// src/components/ParticipantsList.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../supabaseClient';
import { Users, Loader2, AlertCircle } from 'lucide-react';

export default function ParticipantsList({ torneoId }) {
  const { user, isAdmin } = useAuth();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      if (!torneoId) {
        setError('ID torneo mancante');
        setLoading(false);
        return;
      }
      if (!user) {
        setError('Effettua il login per vedere i partecipanti');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from('tournament_participants')
          .select('*')
          .eq('tournament_id', torneoId);

        // Se NON admin, filtriamo solo i propri record
        if (!isAdmin) {
          query = query.eq('user_id', user.id);
        }

        const { data, error } = await query;

        if (error) throw error;

        setParticipants(data || []);
      } catch (err) {
        console.error('Errore fetch participants:', err);
        setError('Errore nel caricamento partecipanti');
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [torneoId, user, isAdmin]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p>Login richiesto per visualizzare i partecipanti</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">
        Partecipanti Torneo ({participants.length})
      </h2>
      {participants.length === 0 ? (
        <p>Nessun partecipante iscritto</p>
      ) : (
        <ul>
          {participants.map((p) => (
            <li key={p.id}>
              {p.nome} {p.cognome} - {p.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
 
