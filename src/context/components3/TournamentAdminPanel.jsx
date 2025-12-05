import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthProvider';
import TournamentBracket from './TournamentBracket';
import TournamentPlayers from './TournamentPlayers';
import TournamentBoardAdmin from './TournamentBoardAdmin'; // ← Il tuo drag & drop!
import TournamentList from './TournamentList';

export default function TournamentAdminPanel() {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('tournaments')
        .select(`
          *, 
          tournament_registrations (id, user_id),
          matches (*)
        `)
        .order('start_date');
      setTournaments(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Caricamento...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Gestione Tornei Admin</h1>
      
      {/* Lista tornei */}
      <TournamentList 
        tournaments={tournaments} 
        onSelect={setSelectedTournament}
        selectedId={selectedTournament?.id}
      />

      {/* Dettaglio selezionato */}
      {selectedTournament && (
        <div className="grid lg:grid-cols-2 gap-8 mt-8 p-6 bg-white rounded-2xl shadow-xl">
          <div>
            <h2 className="text-2xl font-bold mb-6">{selectedTournament.name}</h2>
            <TournamentPlayers tournamentId={selectedTournament.id} />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Tabellone Utenti</h3>
            <TournamentBracket matches={selectedTournament.matches || []} />
            
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-xl font-semibold mb-4">🔧 ADMIN TABLET (Drag & Drop)</h3>
              <TournamentBoardAdmin tournamentId={selectedTournament.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
