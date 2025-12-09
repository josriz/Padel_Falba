// src/components/TournamentDetailDebug.jsx - ✅ LAYOUT DASHBOARD COMPATTO
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthProvider';
import { Shield, Loader2, AlertCircle, UserCheck, Wrench } from 'lucide-react';

export default function TournamentDetailDebug({ torneoId }) {
  const { user, isAdmin } = useAuth();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!torneoId) {
        setError('ID torneo mancante');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('tournaments')
          .select('*')
          .eq('id', torneoId)
          .single();
          
        if (error) throw error;
        setDetail(data);
      } catch (err) {
        console.error('Debug error:', err);
        setError(err.message || 'Errore caricamento torneo');
      } finally {
        setLoading(false);
      }
    };
    
    if (isAdmin) {
      fetchDetail();
    }
  }, [torneoId, isAdmin]);

  // ❌ NO LOGIN
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center py-12 px-6">
        <div className="text-center bg-white p-12 rounded-xl shadow-sm border border-gray-200 max-w-md">
          <AlertCircle className="w-20 h-20 text-red-400 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Login richiesto</h3>
          <p className="text-gray-600 mb-8">Devi effettuare il login per accedere</p>
        </div>
      </div>
    );
  }

  // ❌ NO ADMIN
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center py-12 px-6">
        <div className="text-center bg-white p-12 rounded-xl shadow-sm border border-gray-200 max-w-md">
          <Shield className="w-20 h-20 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Accesso negato</h3>
          <p className="text-gray-600 mb-8">Questa sezione è riservata agli amministratori</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 pt-4 pb-12">
      <div className="p-6 max-w-4xl mx-auto space-y-8">
        {/* ✅ HEADER ADMIN DEBUG */}
        <div className="text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-sm border border-gray-200">
            <Wrench className="w-9 h-9 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Debug Torneo Admin</h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
            ID: <strong>{torneoId}</strong> | Utente: <strong>{user.email}</strong>
          </p>
        </div>

        {/* ✅ LOADING */}
        {loading && (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-6 text-blue-600" />
              <p className="text-xl text-gray-600 font-semibold">Caricamento dettagli...</p>
            </div>
          </div>
        )}

        {/* ✅ ERROR */}
        {error && !loading && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-red-200">
            <div className="flex items-center gap-3 mb-4 p-4 bg-red-50 rounded-xl">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-red-800 text-lg">Errore caricamento</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* ✅ DEBUG DETAIL */}
        {!loading && !error && detail && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 text-white border-b">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <UserCheck className="w-5 h-5" />
                Dettagli Torneo: {detail.name}
              </h2>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              <pre className="bg-gray-50 p-6 rounded-xl text-xs font-mono text-gray-800 border border-gray-200 overflow-x-auto">
                {JSON.stringify(detail, null, 2)}
              </pre>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t text-center text-xs text-gray-500">
              Debug Tool - Solo Admin | Aggiornato: {new Date().toLocaleString('it-IT')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
