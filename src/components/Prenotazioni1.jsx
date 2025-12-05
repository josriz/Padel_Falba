// C:\padel-app\src\components\Prenotazioni.jsx - IL TUO FILE COMPLETO CORRETTO
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { Calendar, Check, Plus } from 'lucide-react';
import PageContainer from './PageContainer';

export default function Prenotazioni(props) {
  const { user } = useAuth();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Recupera slot prenotazioni dal DB
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .order("date", { ascending: true });
        if (error) throw error;
        setSlots(data);
      } catch (err) {
        console.error("Errore caricamento slot:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, []);

  // Prenota uno slot
  const handleBooking = async (slotId) => {
    try {
      const { error } = await supabase.from("bookings").update({
        user_id: user.id
      }).eq("id", slotId).is("user_id", null);

      if (error) throw error;
      alert("Prenotazione confermata!");
      // Aggiorna la lista localmente
      setSlots(slots.map(slot => slot.id === slotId ? { ...slot, user_id: user.id } : slot));
    } catch (err) {
      console.error("Errore prenotazione:", err.message);
      alert("Slot già prenotato o errore di rete.");
    }
  };

  if (loading) return (
    <PageContainer title="Prenotazioni">
      <div className="flex justify-center items-center h-screen">Caricamento prenotazioni...</div>
    </PageContainer>
  );

  return (
    <PageContainer title="Prenotazioni">
      <div className="p-6 pt-20">
        <header className="flex items-center mb-6">
          <Calendar className="w-6 h-6 mr-2 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-800">Prenotazioni</h1>
        </header>

        {slots.length === 0 ? (
          <p className="text-gray-600">Non ci sono slot disponibili al momento.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-indigo-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Data</th>
                  <th className="px-4 py-2 text-left">Orario</th>
                  <th className="px-4 py-2 text-left">Campo</th>
                  <th className="px-4 py-2 text-left">Stato</th>
                  <th className="px-4 py-2">Azione</th>
                </tr>
              </thead>
              <tbody>
                {slots.map((slot) => (
                  <tr key={slot.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{new Date(slot.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{slot.time_slot}</td>
                    <td className="px-4 py-2">{slot.court_id}</td>
                    <td className="px-4 py-2">
                      {slot.user_id ? (
                        <span className="text-green-600 font-semibold flex items-center">
                          <Check className="w-4 h-4 mr-1" /> Occupato
                        </span>
                      ) : (
                        <span className="text-gray-600">Disponibile</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {!slot.user_id && (
                        <button
                          onClick={() => handleBooking(slot.id)}
                          className="flex items-center bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Prenota
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
