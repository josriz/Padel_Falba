import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function DashboardAdmin({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    setLoading(true);
    setMessage('');
    const { data, error } = await supabase.from('bookings').select('*').order('date', { ascending: false }).limit(100);
    if (error) {
      setMessage('❌ Errore nel caricamento delle prenotazioni.');
      setBookings([]);
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Sei sicuro di voler eliminare questa prenotazione?")) return;
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) {
      setMessage('❌ Errore durante l\'eliminazione.');
    } else {
      setMessage('✅ Prenotazione eliminata con successo!');
      fetchAllBookings();
    }
  };

  if (loading) return <p className="p-5">Caricamento pannello Admin...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🛠️ Area Amministratore</h1>
      <p className="mb-6">Benvenuto, {user?.email}. Da qui puoi gestire tutti gli aspetti del club.</p>
      <h3 className="text-2xl mb-4">Gestione Prenotazioni Recenti ({bookings.length})</h3>
      {message && (
        <p className={`p-3 rounded mb-6 border ${message.startsWith('❌') ? 'border-red-600 text-red-600' : 'border-green-600 text-green-600'}`}>
          {message}
        </p>
      )}

      {bookings.length === 0 ? (
        <p>Nessuna prenotazione trovata.</p>
      ) : (
        <div className="grid gap-4">
          {bookings.map(b => (
            <div key={b.id} className="flex justify-between items-center p-4 rounded border bg-gray-50">
              <div>
                <strong>Data: {new Date(b.date).toLocaleDateString()}</strong> | Orario: {b.time_slot}
                <p className="text-sm text-gray-600 mt-1">Campo ID: {b.court_id} | Utente ID: {b.user_id}</p>
              </div>
              <button
                onClick={() => handleDeleteBooking(b.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded cursor-pointer"
              >
                Elimina
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
