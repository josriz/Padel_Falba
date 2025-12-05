// C:\padel-app\src\components\ParticipantsList.jsx - IL TUO FILE COMPLETO CORRETTO
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import PageContainer from './PageContainer';

export default function ParticipantsList({ torneoId }) {
  const { user, isAdmin } = useAuth();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!torneoId) return;

    const fetchParticipants = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('tournament_participants')
          .select('*')
          .eq('torneo_id', torneoId);
        if (error) throw error;
        setParticipants(data);
      } catch (err) {
        console.error('Errore fetch participants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [torneoId]);

  if (loading) return (
    <PageContainer title="ParticipantsList">
      <div>Caricamento partecipanti...</div>
    </PageContainer>
  );

  if (!user) return (
    <PageContainer title="ParticipantsList">
      <div>Devi fare login per vedere i partecipanti</div>
    </PageContainer>
  );

  if (!isAdmin) {
    // utente normale può solo vedere la lista
    return (
      <PageContainer title="ParticipantsList">
        <div>
          <h2>Lista partecipanti</h2>
          <ul>
            {participants.map((p) => (
              <li key={p.id}>{p.name}</li>
            ))}
          </ul>
        </div>
      </PageContainer>
    );
  }

  // admin può anche modificare lo stato dei partecipanti
  const handleUpdateStatus = async (participantId, newStatus) => {
    try {
      const { error } = await supabase
        .from('tournament_participants')
        .update({ status: newStatus })
        .eq('id', participantId);
      if (error) throw error;
      setParticipants((prev) =>
        prev.map((p) => (p.id === participantId ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      console.error('Errore aggiornamento stato:', err);
    }
  };

  return (
    <PageContainer title="ParticipantsList">
      <div>
        <h2>Lista partecipanti</h2>
        <ul>
          {participants.map((p) => (
            <li key={p.id}>
              {p.name} - Stato: {p.status}
              {isAdmin && (
                <>
                  <button onClick={() => handleUpdateStatus(p.id, 'confermato')}>Conferma</button>
                  <button onClick={() => handleUpdateStatus(p.id, 'cancellato')}>Cancella</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </PageContainer>
  );
}
