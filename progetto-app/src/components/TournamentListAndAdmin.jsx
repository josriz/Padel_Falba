import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthProvider';
import { Plus, Trash2, RefreshCw, Users, Loader2 } from 'lucide-react';

export default function TournamentListAndAdmin() {
  const { isAdmin } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [participantsCounts, setParticipantsCounts] = useState({}); // ✅ NUOVO: iscritti per torneo
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    max_players: 16
  });

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      // ✅ TORNEI
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Tornei:', error);
      } else {
        setTournaments(data || []);
        
        // ✅ CONTEGGIO ISCRITTI MULTI-TABELLA per ogni torneo
        const counts = {};
        for (const tournament of data || []) {
          const tables = ['tournament_registrations', 'tournament_participants', 'tournament_players'];
          let totalCount = 0;
          
          for (const table of tables) {
            try {
              const { count } = await supabase
                .from(table)
                .select('*', { count: 'exact', head: true })
                .eq('tournament_id', tournament.id);
              totalCount += count || 0;
              console.log(`✅ ${table} ${tournament.name}: ${count}`);
            } catch (e) {
              console.log(`❌ ${table} non esiste per ${tournament.name}`);
            }
          }
          counts[tournament.id] = totalCount;
        }
        setParticipantsCounts(counts);
        console.log('✅ ADMIN: Conteggi iscritti:', counts);
      }
    } catch (err) {
      console.error('❌ fetchTournaments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTournament = async () => {
    if (!formData.name) return alert('Inserisci il nome del torneo!');
    setLoading(true);
    try {
      const { error } = await supabase.from('tournaments').insert([formData]);
      if (error) throw error;
      alert('✅ Torneo creato con successo!');
      setFormData({ name: '', price: 0, max_players: 16 });
      fetchTournaments(); // ✅ Refresh con nuovi conteggi
    } catch (error) {
      alert('❌ Errore: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTournament = async (id) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo torneo?')) return;
    setDeleteLoading(true);
    try {
      const { error } = await supabase.from('tournaments').delete().eq('id', id);
      if (error) throw error;
      fetchTournaments(); // ✅ Refresh lista
    } catch (error) {
      alert('❌ Errore: ' + error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (!isAdmin) return <div className="text-center p-8 text-red-600">Accesso riservato agli admin</div>;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Loader2 className="animate-spin w-12 h-12 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 pt-6 pb-12">
      <div className="max-w-4xl mx-auto space-y-6 p-6">
        {/* FORM CREA TORNEO */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Crea Nuovo Torneo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Nome torneo"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
            />
            <input
              type="number"
              placeholder="Prezzo (€)"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
            />
            <select
              value={formData.max_players}
              onChange={(e) => setFormData({ ...formData, max_players: Number(e.target.value) })}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
            >
              {[8,16,24,32].map(n => (
                <option key={n} value={n}>{n} giocatori</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleCreateTournament}
            disabled={loading}
            className="w-full mt-4 py-3 px-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            Crea Torneo
          </button>
        </div>

        {/* LISTA TORNEI CON ISCRITTI */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Gestione Tornei ({tournaments.length})
          </h2>
          {tournaments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Nessun torneo creato
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {tournaments.map(t => (
                <div key={t.id} className="p-6 rounded-xl border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all bg-gradient-to-r from-white to-blue-50">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{t.name}</h3>
                    <div className="text-sm bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full font-medium">
                      {participantsCounts[t.id] || 0}/{t.max_players || 16} iscritti
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm mb-6">
                    <div className="flex items-center gap-2 text-gray-700">
                      <span>💰 Prezzo:</span>
                      <span className="font-semibold">€{t.price || 0}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <span>👥 Max:</span>
                      <span className="font-semibold">{t.max_players || 16} giocatori</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <span>📅 Creato:</span>
                      <span className="text-xs">{new Date(t.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleDeleteTournament(t.id)}
                      disabled={deleteLoading}
                      className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 text-sm transition-all disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Elimina
                    </button>
                    <button
                      onClick={() => window.open(`/tournaments/${t.id}`, '_blank')}
                      className="flex-1 py-2.5 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 text-sm transition-all"
                    >
                      <Users className="w-4 h-4" />
                      Visualizza
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BOTTONE AGGIORNA */}
        <div className="text-center">
          <button
            onClick={fetchTournaments}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center gap-2 mx-auto"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Aggiorna Lista ({tournaments.length})
          </button>
        </div>
      </div>
    </div>
  );
}
