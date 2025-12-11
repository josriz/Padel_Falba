import React from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthProvider';

export default function SeedMarketplace() {
  const { user, isAdmin } = useAuth();

  if (!user) return <div>Devi fare login</div>;
  if (!isAdmin) return <div>Accesso negato</div>; // solo admin

  const handleSeed = async () => {
    const items = [
      { name: 'Racchetta Demo', price: 50 },
      { name: 'Palline Demo', price: 10 },
    ];
    for (const item of items) {
      await supabase.from('marketplace').insert([item]);
    }
    alert('Dati demo inseriti!');
  };

  return (
    <div>
      <h2>Seed Marketplace (Admin)</h2>
      <button onClick={handleSeed}>Inserisci dati demo</button>
    </div>
  );
}
