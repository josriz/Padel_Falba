// src/components/EventiTornei.jsx - COMPLETO CORRETTO
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { CheckCircle } from 'lucide-react';
import PageContainer from './PageContainer';
import { supabase } from '../supabaseClient';  // ✅ AGGIUNTO

export default function EventiTornei({ torneoId = 'demo-torneo-001' }) {
  const { user, isAdmin } = useAuth();
  const [torneo, setTorneo] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ nome: '', livello: 'Intermedio', telefono: '' });

  useEffect(() => {
    fetchTorneo();
    fetchParticipants();
  }, [torneoId]);

  const fetchTorneo = async () => {
    const { data } = await supabase
      .from('tournaments')
      .select('nome, stato, max_giocatori')
      .eq('id', torneoId)
      .single();
    setTorneo(data);
  };

  const fetchParticipants = async () => {
    const { data } = await supabase
      .from('tournament_participants')
      .select('*')
      .eq('torneo_id', torneoId);
    setParticipants(data || []);
    setLoading(false);
  };

  const handleIscrizione = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('❌ Devi fare login!');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('tournament_participants')
        .insert({
          torneo_id: torneoId,
          user_id: user.id,
          nome: formData.nome || user.email.split('@')[0],
          livello: formData.livello,
          telefono: formData.telefono,
          status: 'iscritto'
        });
      if (error) throw error;
      alert('✅ ISCRITTO!');
      fetchParticipants();
      setFormData({ nome: '', livello: 'Intermedio', telefono: '' });
    } catch (err) {
      alert('❌ Errore: ' + err.message);
    }
  };

  const chiudiIscrizioni = async () => {
    const { error } = await supabase
      .from('tournaments')
      .update({ stato: 'tabellone' })
      .eq('id', torneoId);
    if (error) alert('Errore: ' + error.message);
    else {
      alert('✅ Iscrizioni chiuse!');
      fetchTorneo();
    }
  };

  if (loading) return (
    <PageContainer title="Eventi e Tornei">
      <div className="text-center py-20">⏳ Caricamento torneo...</div>
    </PageContainer>
  );

  return (
    <PageContainer title="Eventi e Tornei">
      <div className="pt-20 p-8 max-w-6xl mx-auto min-h-screen bg-gray-50">
        {/* HEADER TORNEO */}
        <div className="bg-white rounded-3xl shadow-2xl border p-12 mb-12 text-center">
          <h1 className="text-5xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
            {torneo?.nome || 'Torneo Open Bari 2025'}
          </h1>
          <div className="flex flex-wrap justify-center gap-6 text-2xl mb-8">
            <span>👥 {participants.length}/{torneo?.max_giocatori || 16} iscritti</span>
            <span className={`px-8 py-4 rounded-3xl font-bold text-xl shadow-lg ${
              torneo?.stato === 'iscrizioni_aperte' 
                ? 'bg-blue-500/20 text-blue-800 border-4 border-blue-300' 
                : 'bg-emerald-500/20 text-emerald-800 border-4 border-emerald-300'
            }`}>
              {torneo?.stato === 'iscrizioni_aperte' ? '📝 ISCRIZIONI APERTE' : '🏆 TABELLONE'}
            </span>
          </div>
          
          {isAdmin && torneo?.stato === 'iscrizioni_aperte' && participants.length >= 8 && (
            <button 
              onClick={chiudiIscrizioni} 
              className="px-10 py-4 bg-emerald-600 text-white font-black text-xl rounded-3xl hover:shadow-3xl transition-all"
            >
              <CheckCircle className="w-6 h-6 inline mr-2" /> Chiudi Iscrizioni
            </button>
          )}
        </div>

        {/* FORM ISCRIZIONE */}
        {torneo?.stato === 'iscrizioni_aperte' && !participants.some(p => p.user_id === user?.id) && (
          <div className="bg-white/90 backdrop-blur-xl rounded-4xl shadow-3xl border p-12 mb-12">
            <h2 className="text-4xl font-black text-orange-800 mb-12 text-center">📝 ISCRIVITI AL TORNEO</h2>
            <form onSubmit={handleIscrizione} className="grid md:grid-cols-3 gap-8 mb-12 p-10 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-4xl shadow-2xl">
              <input 
                value={formData.nome} 
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                placeholder="Nome (opzionale)" 
                className="p-6 border-2 border-blue-200 rounded-3xl text-2xl focus:ring-4 focus:ring-blue-500/30" 
              />
              <select 
                value={formData.livello} 
                onChange={(e) => setFormData({...formData, livello: e.target.value})}
                className="p-6 border-2 border-blue-200 rounded-3xl text-2xl focus:ring-4 focus:ring-blue-500/30"
              >
                <option>Principiante</option>
                <option>Intermedio</option>
                <option>Avanzato</option>
              </select>
              <input 
                value={formData.telefono} 
                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                placeholder="Telefono" 
                className="p-6 border-2 border-blue-200 rounded-3xl text-2xl focus:ring-4 focus:ring-blue-500/30" 
                required 
              />
              <button 
                type="submit" 
                className="md:col-span-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-8 px-12 font-black text-3xl rounded-4xl hover:shadow-3xl transition-all"
              >
                ➡️ CONFERMA ISCRIZIONE
              </button>
            </form>
          </div>
        )}

        {/* LISTA ISCRITTI */}
        {participants.length > 0 && (
          <div className="bg-white/90 backdrop-blur-xl rounded-4xl shadow-3xl border p-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              👥 ISCRITTI ({participants.length}/{torneo?.max_giocatori || 16})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {participants.map(p => (
                <div key={p.id} className={`p-8 rounded-3xl border-2 hover:shadow-2xl transition-all ${
                  p.user_id === user?.id 
                    ? 'border-emerald-300 bg-emerald-50 shadow-emerald-200' 
                    : 'border-gray-100 bg-gradient-to-br from-gray-50 to-white'
                }`}>
                  <div className="text-2xl font-black text-gray-900 mb-2">{p.nome}</div>
                  <div className="text-xl text-blue-600 font-semibold mb-2">{p.livello}</div>
                  <div className="text-lg text-gray-600 mb-1">{p.telefono}</div>
                  {p.user_id === user?.id && (
                    <div className="text-xs bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full mt-3 font-bold inline-block">
                      ✅ TU
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
