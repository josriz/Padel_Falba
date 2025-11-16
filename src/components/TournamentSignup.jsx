// src/components/TournamentSignup.jsx
import React, { useState } from 'react';
import { useSupabase } from '../SupabaseContext';

export default function TournamentSignup({ user }) {
  const supabase = useSupabase();
  const [loading, setLoading] = useState(false);

  const handleTournamentSignup = async () => {
    if (!user) {
      alert("Devi essere loggato per iscriverti al torneo!");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tournament_players')
        .insert([
          {
            name: user.user_metadata?.full_name || user.email,
            email: user.email,
            user_id: user.id
          }
        ]);

      if (error) {
        console.error("Errore durante l'iscrizione:", error);
        alert("❌ Errore iscrizione: " + error.message);
      } else {
        console.log("Iscrizione avvenuta:", data);
        alert("✅ Iscrizione avvenuta con successo!");
      }
    } catch (err) {
      console.error("Errore imprevisto:", err);
      alert("❌ Errore imprevisto: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-xl font-bold">Iscriviti al torneo</h2>
      <button
        onClick={handleTournamentSignup}
        disabled={loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Iscrizione in corso..." : "Iscriviti"}
      </button>
    </div>
  );
}
