import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { supabase } from "../supabaseClient";
import { Users, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function EventSignup({ eventId }) {
  const { user } = useAuth();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (eventId) fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const { data } = await supabase.from('events').select('*').eq('id', eventId).single();
      setEventData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!user) {
      setMessage({ type: 'error', text: 'Devi fare login!' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.from('event_registrations').insert({
        event_id: eventId,
        user_id: user.id
      });

      if (error) throw error;
      setMessage({ type: 'success', text: `✅ Iscrizione completata! Prezzo: €${eventData?.price || 0}` });
    } catch (err) {
      setMessage({ type: 'error', text: `❌ Errore: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12"><Loader2 className="w-10 h-10 animate-spin mx-auto" /> Caricamento evento...</div>;

  if (!user) return (
    <div className="text-center p-6 bg-red-50 border border-red-200 rounded-xl">
      <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
      <p className="font-semibold text-gray-900 mb-2">Login richiesto</p>
      <p className="text-sm text-gray-600">Devi effettuare il login per iscriverti</p>
      <a href="/auth" className="block w-full py-3 px-6 bg-blue-600 text-white rounded-xl font-bold">Vai al Login →</a>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-bold text-gray-900">{eventData?.name}</h2>
      {eventData && <p className="text-sm text-gray-700">Prezzo partecipazione: €{eventData.price || 0}</p>}

      {message && (
        <div className={`p-4 rounded-xl flex items-start gap-3 shadow-sm ${
          message.type === 'success'
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5 mt-0.5" /> : <AlertCircle className="w-5 h-5 mt-0.5" />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <button
        onClick={handleSignup}
        disabled={loading}
        className="w-full py-3 px-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Users className="w-5 h-5" />}
        Iscriviti all'evento
      </button>
    </div>
  );
}
