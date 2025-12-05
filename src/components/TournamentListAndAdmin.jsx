// src/components/TournamentListAndAdmin.jsx - ✅ FIXATO
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../supabaseClient';
import { Plus, Trash2, Loader2, RefreshCw, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TournamentListAndAdmin() {
  const { isAdmin } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', status: 'pianificato' });

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      // ✅ FIX: NO auth.users! → Solo tournament_registrations COUNT
      const { data, error } = await supabase
        .from('tournaments')
        .select(`
          *,
          tournament_registrations (
            count
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTournaments(data || []);
    } catch (error) {
      console.error('Fetch error:', error);
    }
    setLoading(false);
  };

  useEffect(() => { fetchTournaments(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('tournaments')
        .insert([{ name: formData.name.trim(), status: formData.status }]);
      if (error) throw error;

      alert('✅ Torneo creato!');
      setShowForm(false);
      setFormData({ name: '', status: 'pianificato' });
      fetchTournaments();
    } catch (error) {
      alert('❌ Errore: ' + error.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Eliminare questo torneo?')) {
      setDeletingId(id);
      try {
        const { error } = await supabase.from('tournaments').delete().eq('id', id);
        if (error) throw error;
        fetchTournaments();
      } catch (error) {
        alert('❌ Errore eliminazione: ' + error.message);
      }
      setDeletingId(null);
    }
  };

  const getRegistrationsCount = (tournament) => {
    return tournament?.tournament_registrations?.[0]?.count || 0;
  };

  if (!isAdmin) return (
    <div className="min-h-screen flex items-center justify-center bg-white p-8">
      <div className="bg-white border border-red-300 p-10 rounded-lg shadow-lg text-center text-red-700">
        🚫 Accesso Negato - Solo Admin
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-semibold text-gray-800">👑 Gestione Tornei Admin</h1>
        <div className="flex gap-4">
          <button onClick={fetchTournaments} disabled={loading} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all">
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} /> Aggiorna
          </button>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all font-semibold">
            <Plus className="w-5 h-5" /> {showForm ? 'Annulla' : 'Nuovo Torneo'}
          </button>
        </div>
      </header>

      {showForm && (
        <div className="mb-12 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl shadow-xl max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nome Torneo" className="w-full p-4 border rounded-xl" required />
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full p-4 border rounded-xl">
              <option value="pianificato">📅 Pianificato</option>
              <option value="in_corso">⚡ In Corso</option>
              <option value="completato">✅ Completato</option>
            </select>
            <button type="submit" disabled={loading} className="w-full p-4 bg-green-600 text-white rounded-xl">Crea Torneo</button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {tournaments.map((t) => (
          <div key={t.id} className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{t.name}</h3>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${t.status === 'pianificato' ? 'bg-blue-100 text-blue-800' : t.status === 'in_corso' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
              {t.status === 'pianificato' ? '📅 Pianificato' : t.status === 'in_corso' ? '⚡ In Corso' : '✅ Completato'}
            </span>
            <div className="flex justify-between mt-4 text-sm text-gray-600">
              <span>Iscritti: {getRegistrationsCount(t)}</span>
              <Link to={`/torneo/${t.id}`} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold hover:bg-blue-200 transition-all">Vai al torneo</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
