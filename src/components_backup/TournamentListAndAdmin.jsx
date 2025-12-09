import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../supabaseClient';
import { Plus, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TournamentListAndAdmin() {
  const { isAdmin } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [participantsCounts, setParticipantsCounts] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    status: 'pianificato',
    data_inizio: new Date().toISOString().split('T')[0]
  });

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select(`
          id,
          name, 
          status,
          max_players,
          players_count,
          data_inizio,
          created_at
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      console.log('✅ Tournaments loaded:', data?.length || 0);
      setTournaments(data || []);
      
      // ✅ DEBUG: Fetch contatori con ERROR LOG
      const counts = {};
      for (const t of data) {
        try {
          const { count, error: countError } = await supabase
            .from('tournament_participants')
            .select('*', { count: 'exact', head: true })
            .eq('tournament_id', t.id);
          
          if (countError) {
            console.error(`❌ COUNT ERROR ${t.id}:`, countError);
            counts[t.id] = 0;
          } else {
            console.log(`✅ ${t.name}: ${count} partecipanti`);
            counts[t.id] = count || 0;
          }
        } catch (err) {
          console.error(`❌ FETCH ERROR ${t.id}:`, err);
          counts[t.id] = 0;
        }
      }
      setParticipantsCounts(counts);
      console.log('✅ TUTTI COUNTS:', counts);
    } catch (error) {
      console.error('❌ Fetch tournaments error:', error);
    }
    setLoading(false);
  };

  useEffect(() => { 
    fetchTournaments(); 
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('tournaments')
        .insert([{ 
          name: formData.name.trim(), 
          status: formData.status,
          max_players: 32,
          data_inizio: formData.data_inizio
        }]);
      if (error) throw error;
      setShowForm(false);
      setFormData({ 
        name: '', 
        status: 'pianificato',
        data_inizio: new Date().toISOString().split('T')[0]
      });
      fetchTournaments();
    } catch (error) {
      alert('Errore: ' + error.message);
    }
    setLoading(false);
  };

  console.log('isAdmin:', isAdmin);

  if (!isAdmin) {
    return (
      <div className="p-8">
        <div>🚫 Solo Admin - isAdmin: {isAdmin ? 'TRUE' : 'FALSE'}</div>
        <button onClick={fetchTournaments}>Test Query</button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex justify-between mb-8">
        <h1 className="text-4xl font-semibold">Gestione Tornei Admin</h1>
        <div className="flex gap-4">
          <button onClick={fetchTournaments} disabled={loading}>
            <RefreshCw className={loading ? 'animate-spin' : ''} /> Aggiorna
          </button>
          <button onClick={() => setShowForm(!showForm)}>
            <Plus /> {showForm ? 'Annulla' : 'Nuovo Torneo'}
          </button>
        </div>
      </header>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 space-y-4 p-4 border rounded">
          <input 
            type="text" 
            value={formData.name} 
            onChange={e => setFormData({ ...formData, name: e.target.value })} 
            placeholder="Nome Torneo" 
            required 
            className="w-full p-2 border rounded"
          />
          <select 
            value={formData.status} 
            onChange={e => setFormData({ ...formData, status: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="pianificato">Pianificato</option>
            <option value="active">Attivo</option>
            <option value="completato">Completato</option>
          </select>
          <input 
            type="date" 
            value={formData.data_inizio} 
            onChange={e => setFormData({ ...formData, data_inizio: e.target.value })} 
            className="w-full p-2 border rounded"
          />
          <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2 rounded">
            Crea Torneo
          </button>
        </form>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tournaments.map((t) => {
          const participantsCount = participantsCounts[t.id] || 0;
          return (
            <div key={t.id} className="p-6 border rounded-lg shadow hover:shadow-lg">
              <h3 className="font-bold text-xl mb-2">{t.name}</h3>
              <p><strong>Status:</strong> {t.status}</p>
              <p><strong>Giocatori:</strong> <span className="font-bold text-green-600">{participantsCount}</span>/{t.max_players || 'N/D'}</p>
              {t.data_inizio && <p><strong>Inizio:</strong> {new Date(t.data_inizio).toLocaleDateString()}</p>}
              
              <div className="mt-4 space-y-2">
                <Link 
                  to={`/tournaments/${t.id}`}
                  className="block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center"
                >
                  Vai al torneo →
                </Link>
                <Link 
                  to={`/tournaments/${t.id}/bracket`}
                  className="block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-center"
                >
                  Tabellone → ({participantsCount})
                </Link>
              </div>
            </div>
          );
        })}
        {tournaments.length === 0 && !loading && (
          <div className="col-span-full p-8 text-center text-gray-500">
            Nessun torneo trovato
          </div>
        )}
      </div>
    </div>
  );
}
