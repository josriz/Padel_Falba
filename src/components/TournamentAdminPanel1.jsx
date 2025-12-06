import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../supabaseClient';
import { Plus, Trash2, Loader2, RefreshCw } from 'lucide-react';
import TournamentBracket from './components/TournamentBracket';


export default function TournamentListAndAdmin() {
  const { isAdmin } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', status: 'pianificato' });

  const fetchTournaments = async () => {
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')  // NO columns param → BYPASS cache
        .order('created_at', { ascending: false });
      
      console.log('✅ FETCH OK:', data);
      if (error) throw error;
      setTournaments(data || []);
    } catch (error) {
      console.error('❌ FETCH:', error);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = [{
        name: formData.name.trim(),
        status: formData.status
      }];
      
      console.log('🔄 INSERT PAYLOAD:', payload);
      
      const { error } = await supabase
        .from('tournaments')
        .insert(payload);
      
      if (error) throw error;
      
      alert('✅ Torneo creato!');
      setShowForm(false);
      setFormData({ name: '', status: 'pianificato' });
      fetchTournaments();
    } catch (error) {
      console.error('❌ INSERT ERROR:', error);
      alert('❌ ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Eliminare?')) {
      const { error } = await supabase
        .from('tournaments')
        .delete()
        .eq('id', id);
      if (!error) fetchTournaments();
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">🏆 Tornei Padel</h1>
        <div className="flex gap-3">
          <button onClick={fetchTournaments} className="px-4 py-2 bg-blue-500 text-white rounded">
            🔄 Aggiorna
          </button>
          <button onClick={() => setShowForm(!showForm)} className="px-6 py-2 bg-green-500 text-white rounded font-bold">
            {showForm ? '❌ Annulla' : '➕ Nuovo'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-xl mb-8 max-w-md mx-auto">
          <div className="space-y-4">
            <input
              placeholder="Nome torneo"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500"
              required
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              <option value="pianificato">📅 Pianificato</option>
              <option value="in_corso">⚡ In Corso</option>
              <option value="completato">✅ Completato</option>
            </select>
            <button disabled={loading} className="w-full p-4 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 disabled:opacity-50">
              {loading ? '⏳ Creazione...' : '✅ Crea Torneo'}
            </button>
          </div>
        </form>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((t) => (
          <div key={t.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl">
            <h3 className="text-xl font-bold mb-3">{t.name}</h3>
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {t.status === 'pianificato' ? '📅 Pianificato' :
               t.status === 'in_corso' ? '⚡ In Corso' : '✅ Completato'}
            </span>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(t.created_at).toLocaleDateString('it-IT')}
            </p>
            <button onClick={() => handleDelete(t.id)} className="mt-4 w-full p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 font-semibold">
              🗑️ Elimina
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
