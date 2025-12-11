
// src/components/Prenotazioni.jsx - ✅ LAYOUT DASHBOARD COMPATTO
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../supabaseClient';
import { Calendar, Check, Plus, Loader2, AlertCircle } from 'lucide-react';

export default function Prenotazioni() {
  const { user } = useAuth();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Recupera slot prenotazioni dal DB
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .order("date", { ascending: true });
          
        if (error) throw error;
        setSlots(data || []);
      } catch (err) {
        console.error("Errore caricamento slot:", err.message);
        setError("Errore nel caricamento delle prenotazioni");
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
      alert("✅ Prenotazione confermata!");
      // Aggiorna la lista localmente
      setSlots(slots.map(slot => slot.id === slotId ? { ...slot, user_id: user.id } : slot));
    } catch (err) {
      console.error("Errore prenotazione:", err.message);
      alert("❌ Slot già prenotato o errore di rete.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center py-12 px-6">
        <div className="text-center bg-white p-12 rounded-xl shadow-sm border border-gray-200">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-6 text-blue-600" />
          <p className="text-xl text-gray-600 font-semibold">Caricamento prenotazioni...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 pt-4 pb-12">
      <div className="p-6 max-w-6xl mx-auto space-y-8">
        {/* ✅ HEADER IDENTICO DASHBOARD */}
        <div className="text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-sm border border-gray-200">
            <Calendar className="w-9 h-9 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Prenotazioni</h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
            Gestisci le tue prenotazioni campo padel
          </p>
        </div>

        {/* ✅ ERROR STATE */}
        {error && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-red-200 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h3 className="font-bold text-red-800 text-lg">Errore</h3>
            </div>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* ✅ TABELLA COMPATTA */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-emerald-50 px-6 py-4 border-b">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              Slot Disponibili
            </h2>
          </div>
          
          {slots.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nessuna prenotazione disponibile</h3>
              <p className="text-gray-600">Torna presto per nuovi slot!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Data</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Orario</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Campo</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Stato</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Azione</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {slots.map((slot) => (
                    <tr key={slot.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {new Date(slot.date).toLocaleDateString('it-IT')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{slot.time_slot}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                          Campo {slot.court_id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {slot.user_id ? (
                          <span className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                            <Check className="w-4 h-4" />
                            Prenotato
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                            Disponibile
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {!slot.user_id && user && (
                          <button
                            onClick={() => handleBooking(slot.id)}
                            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all whitespace-nowrap"
                          >
                            <Plus className="w-4 h-4" />
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
      </div>
    </div>
  );
}
