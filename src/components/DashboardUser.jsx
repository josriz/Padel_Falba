import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function DashboardUser({ user }) {
  const [profileName, setProfileName] = useState('Utente');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileName = async () => {
      if (!user) return;
      setLoading(true);

      const { data, error } = await supabase
        .from('profiles')
        .select('nome_completo')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error("Errore nel recupero del profilo utente:", error.message);
      } 

      let displayName = user.email;
      if (data?.nome_completo) {
        displayName = data.nome_completo.split(' ')[0];
      } else if (user.user_metadata?.first_name) {
        displayName = user.user_metadata.first_name;
      }

      setProfileName(displayName);
      setLoading(false);
    };

    fetchProfileName();
  }, [user]);

  if (loading) {
    return <h2 className="p-5 text-center text-gray-600">Caricamento...</h2>;
  }

  return (
    <div className="p-5 border-b border-gray-300 max-w-4xl mx-auto box-border w-full">
      <h1 className="text-3xl font-semibold">👋 Benvenuto, {profileName}!</h1>
      {/* Area libera per contenuti amministrativi o personali */}
    </div>
  );
}
