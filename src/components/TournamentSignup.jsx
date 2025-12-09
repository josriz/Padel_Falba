// src/components/TournamentSignup.jsx - ✅ LAYOUT DASHBOARD COMPATTO
import React, { useState } from 'react';
import { registerToTournament } from '../utils/registerToTournament';
import { useAuth } from '../context/AuthProvider';
import { Users, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function TournamentSignup({ tournamentId, onSuccess }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSignup = async () => {
    if (!user) {
      setMessage({ type: 'error', text: 'Devi effettuare il login per iscriverti' });
      return;
    }
    
    if (!tournamentId) {
      setMessage({ type: 'error', text: 'ID torneo mancante' });
      return;
    }

    setLoading(true);
    setMessage(null);
    
    try {
      const res = await registerToTournament({ 
        userId: user.id, 
        tournamentId 
      });
      
      setLoading(false);
      
      if (res.ok) {
        setMessage({ type: 'success', text: '✅ Iscrizione avvenuta con successo!' });
        if (onSuccess) onSuccess(res.data);
      } else {
        setMessage({ type: 'error', text: `❌ Errore: ${res.error?.message || 'Errore sconosciuto'}` });
      }
    } catch (error) {
      setLoading(false);
      setMessage({ type: 'error', text: `❌ Errore: ${error.message}` });
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-md mx-auto hover:shadow-md transition-all hover:-translate-y-0.5">
      {/* ✅ HEADER COMPATTO */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-sm border border-gray-200">
          <Users className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Iscrizione Torneo</h2>
        <p className="text-sm text-gray-600">Torneo ID: <strong>{tournamentId}</strong></p>
      </div>
      
      {/* ✅ MESSAGGI */}
      {message && (
        <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 shadow-sm ${
          message.type === 'success' 
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}
      
      {/* ✅ NO LOGIN */}
      {!user && (
        <div className="text-center py-8 space-y-4">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />
          <p className="text-lg font-semibold text-gray-900 mb-4">Login richiesto</p>
          <p className="text-sm text-gray-600 mb-6">Devi effettuare il login per iscriverti</p>
          <a 
            href="/auth" 
            className="block w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all text-sm flex items-center justify-center gap-2"
          >
            Vai al Login →
          </a>
        </div>
      )}
      
      {/* ✅ CON LOGIN */}
      {user && (
        <div className="space-y-4">
          <button 
            onClick={handleSignup} 
            disabled={loading || !tournamentId}
            className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Iscrizione in corso...
              </>
            ) : (
              <>
                <Users className="w-5 h-5" />
                📝 Iscriviti al Torneo
              </>
            )}
          </button>
          
          <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-100">
            Utente: <strong>{user.email}</strong>
          </div>
        </div>
      )}
    </div>
  );
}
