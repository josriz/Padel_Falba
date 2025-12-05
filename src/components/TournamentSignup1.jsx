// src/components/TournamentSignup.jsx
import React, { useState } from 'react';
import { registerToTournament } from '../utils/registerToTournament';
import { useAuth } from '../context/AuthProvider';

export default function TournamentSignup({ tournamentId, onSuccess }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSignup = async () => {
    if (!user) {
      setMessage('Devi effettuare il login');
      return;
    }
    
    if (!tournamentId) {
      setMessage('ID torneo mancante');
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
        setMessage('✅ Iscrizione avvenuta con successo!');
        if (onSuccess) onSuccess(res.data);
      } else {
        setMessage('❌ Errore durante l\'iscrizione: ' + (res.error?.message || 'Errore sconosciuto'));
      }
    } catch (error) {
      setLoading(false);
      setMessage('❌ Errore: ' + error.message);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Iscrizione Torneo</h2>
      
      {!user && (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Devi effettuare il login per iscriverti</p>
          <a href="/auth" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
            Vai al Login
          </a>
        </div>
      )}
      
      {user && (
        <>
          {message && (
            <div className={`mb-4 p-3 rounded-lg text-white ${
              message.includes('✅') ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {message}
            </div>
          )}
          
          <button 
            onClick={handleSignup} 
            disabled={loading || !tournamentId}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '⏳ Iscrizione in corso...' : '📝 Iscriviti al Torneo'}
          </button>
          
          <div className="mt-4 text-sm text-gray-600 text-center">
            Torneo ID: <strong>{tournamentId}</strong>
          </div>
        </>
      )}
    </div>
  );
}
