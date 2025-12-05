import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthProvider';

export default function TournamentDetailDebug({ torneoId }) {
  const { user, isAdmin } = useAuth();
  const [detail, setDetail] = useState(null);

  if (!user) return <div>Devi fare login</div>;
  if (!isAdmin) return <div>Accesso negato</div>;

  useEffect(() => {
    const fetchDetail = async () => {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', torneoId)
        .single();
      if (error) console.error(error);
      else setDetail(data);
    };
    fetchDetail();
  }, [torneoId]);

  if (!detail) return <div>Caricamento dettagli torneo...</div>;

  return (
    <div>
      <h2>Debug Torneo: {detail.name}</h2>
      <pre>{JSON.stringify(detail, null, 2)}</pre>
      {/* Qui admin può modificare dettagli o fare test */}
    </div>
  );
}
