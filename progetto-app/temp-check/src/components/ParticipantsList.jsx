// src/components/ParticipantsList.jsx - ✅ LAYOUT DASHBOARD COMPATTO
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../supabaseClient';
import { Users, Loader2, AlertCircle, CheckCircle, UserX, Shield } from 'lucide-react';

export default function ParticipantsList({ torneoId }) {
  const { user, isAdmin } = useAuth();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!torneoId) {
      setError('ID torneo mancante');
      setLoading(false);
      return;
    }

    const fetchParticipants = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('tournament_participants')
          .select('*')
          .eq('torneo_id', torneoId);
          
        if (error) throw error;
        setParticipants(data || []);
      } catch (err) {
        console.error('Errore fetch participants:', err);
        setError('Errore nel caricamento partecipanti');
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [torneoId]);

  const handleUpdateStatus = async (participantId, newStatus) => {
    try {
      const { error } = await supabase
        .from('tournament_participants')
        .update({ status: newStatus })
        .eq('id', participantId);
        
      if (error) throw error;
      
      setParticipants((prev) =>
        prev.map((p) => (p.id === participantId ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      console.error('Errore aggiornamento stato:', err);
      alert('❌ Errore aggiornamento stato');
    }
  };

  // NO LOGIN
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center py-12 px-6">
        <div className="text-center bg-white p-12 rounded-xl shadow-sm border border-gray-200 max-w-md">
          <AlertCircle className="w-20 h-20 text-red-400 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Login richiesto</h3>
          <p className="text-gray-600 mb-8">Effettua il login per vedere i partecipanti</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center py-12 px-6">
        <div className="text-center bg-white p-12 rounded-xl shadow-sm border border-gray-200">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-6 text-blue-600" />
          <p className="text-xl text-gray-600 font-semibold">Caricamento partecipanti...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 pt-4 pb-12">
      <div className="p-6 max-w-4xl mx-auto space-y-8">
        {/* ✅ HEADER IDENTICO DASHBOARD */}
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-sm border border-gray-200">
            <Users className="w-9 h-9 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Partecipanti Torneo <span className="text-sm font-normal text-gray-500">#{torneoId}</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
            ({participants.length}) Gestisci i partecipanti
          </p>
        </div>

        {/* ✅ ERROR */}
        {error && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-red-200 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h3 className="font-bold text-red-800 text-lg">{error}</h3>
            </div>
          </div>
        )}

        {/* ✅ TABELLA PARTECIPANTI COMPATTA */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-blue-50 px-6 py-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Lista Partecipanti ({participants.length})
            </h2>
            {isAdmin && (
              <div className="px-4 py-2 bg-emerald-100 text-emerald-800 text-sm font-bold rounded-xl">
                <Shield className="w-4 h-4 inline mr-1" />
                MODALITÀ ADMIN
              </div>
            )}
          </div>
          
          {participants.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nessun partecipante</h3>
              <p className="text-gray-600">Aggiungi i primi partecipanti al torneo</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nome</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Stato</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Data</th>
                    {!isAdmin && <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Azioni</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {participants.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-700">
                            {p.name?.[0]?.toUpperCase() || 'P'}
                          </div>
                          <span className="font-semibold text-gray-900">{p.name || 'N/D'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          p.status === 'confermato' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : p.status === 'cancellato' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {p.status || 'In attesa'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {p.created_at ? new Date(p.created_at).toLocaleDateString('it-IT') : 'N/D'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isAdmin ? (
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleUpdateStatus(p.id, 'confermato')}
                              className="flex items-center gap-1 px-3 py-2 bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Conferma
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(p.id, 'cancellato')}
                              className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                            >
                              <UserX className="w-4 h-4" />
                              Cancella
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Visualizzazione</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
