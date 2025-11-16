import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Prenotazioni({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    campo_id: '',
    data_ora: '',
    durata_min: 60,
    sfidante_email: '',
    phone: '',
    livello: 'principiante',
    tipo_partita: 'allenamento',
    note: '',
    stato: 'confermata',
    altro_campo: '',
  });
  const [message, setMessage] = useState('');

  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    fetchBookings();
  }, [userId]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('prenotazioni')
        .select(`*, campi ( nome )`)
        .or(`user_id.eq.${userId},sfidante_id.eq.${userId}`)
        .gte('data_ora', new Date().toISOString())
        .order('data_ora', { ascending: true });

      if (error) throw error;
      setBookings(data || []);
      setMessage('');
    } catch {
      setMessage('Errore nel caricamento delle tue prenotazioni.');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!userId) {
      setMessage('Devi essere loggato per prenotare.');
      return;
    }

    let sfidanteId = null;
    if (form.sfidante_email) {
      const { data: sfidanteData, error: sfidanteError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', form.sfidante_email)
        .single();

      if (sfidanteError || !sfidanteData) {
        setMessage('Email sfidante non trovata o non registrata.');
        return;
      }
      sfidanteId = sfidanteData.id;
    }

    const newBooking = {
      user_id: userId,
      campo_id: form.campo_id,
      data_ora: form.data_ora,
      durata_min: form.durata_min,
      sfidante_id: sfidanteId,
      stato: form.stato,
      phone: form.phone,
      livello: form.livello,
      tipo_partita: form.tipo_partita,
      note: form.note,
      altro_campo: form.altro_campo,
    };

    const { error } = await supabase.from('prenotazioni').insert([newBooking]);

    if (!error) {
      setMessage('✅ Prenotazione effettuata con successo!');
      setForm({
        campo_id: '',
        data_ora: '',
        durata_min: 60,
        sfidante_email: '',
        phone: '',
        livello: 'principiante',
        tipo_partita: 'allenamento',
        note: '',
        stato: 'confermata',
        altro_campo: '',
      });
      fetchBookings();
    } else {
      setMessage(`❌ Errore prenotazione: ${error.message}. Il campo potrebbe essere già occupato.`);
    }
  };

  if (loading)
    return <div className="p-6 text-center text-gray-600">Caricamento prenotazioni...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 border border-gray-300 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">🎾 Nuova Prenotazione Campo</h2>

      {message && (
        <p
          className={`mb-6 p-3 rounded ${
            message.startsWith('✅')
              ? 'bg-green-100 text-green-700 border border-green-400'
              : 'bg-red-100 text-red-700 border border-red-400'
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleBooking} className="space-y-4">
        {/* select campo con 10 opzioni */}
        <div>
          <label htmlFor="campo_id" className="block mb-1 font-medium">Campo:</label>
          <select
            id="campo_id"
            value={form.campo_id}
            onChange={(e) => setForm({ ...form, campo_id: e.target.value })}
            required
            className="w-full p-3 border border-gray-300 rounded"
          >
            <option value="">Seleziona Campo</option>
            <option value="1">Campo 1 (Standard)</option>
            <option value="2">Campo 2 (Premium)</option>
            <option value="3">Campo 3 (Indoor)</option>
            <option value="4">Campo 4 (Outdoor)</option>
            <option value="5">Campo 5 (VIP)</option>
            <option value="6">Campo 6 (Junior)</option>
            <option value="7">Campo 7 (Senior)</option>
            <option value="8">Campo 8 (Practice)</option>
            <option value="9">Campo 9 (Tournament)</option>
            <option value="10">Campo 10 (Special)</option>
          </select>
        </div>

        {/* Altri campi */}
        <div>
          <label htmlFor="data_ora" className="block mb-1 font-medium">Data e Ora:</label>
          <input type="datetime-local" id="data_ora"
            value={form.data_ora} onChange={(e) => setForm({ ...form, data_ora: e.target.value })}
            required className="w-full p-3 border border-gray-300 rounded" />
        </div>

        <div>
          <label htmlFor="durata_min" className="block mb-1 font-medium">Durata (minuti):</label>
          <select id="durata_min"
            value={form.durata_min} onChange={(e) => setForm({ ...form, durata_min: parseInt(e.target.value) })}
            required className="w-full p-3 border border-gray-300 rounded">
            <option value="60">60 minuti</option>
            <option value="90">90 minuti</option>
          </select>
        </div>

        <div>
          <label htmlFor="sfidante_email" className="block mb-1 font-medium">Email Sfidante (Opzionale):</label>
          <input type="email" id="sfidante_email" placeholder="email@sfidante.it"
            value={form.sfidante_email} onChange={(e) => setForm({ ...form, sfidante_email: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded" />
        </div>

        <div>
          <label htmlFor="phone" className="block mb-1 font-medium">Telefono contatto</label>
          <input type="tel" id="phone"
            value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded" />
        </div>

        <div>
          <label htmlFor="livello" className="block mb-1 font-medium">Livello di gioco</label>
          <select id="livello" value={form.livello} onChange={(e) => setForm({ ...form, livello: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded">
            <option value="principiante">Principiante</option>
            <option value="intermedio">Intermedio</option>
            <option value="avanzato">Avanzato</option>
          </select>
        </div>

        <div>
          <label htmlFor="tipo_partita" className="block mb-1 font-medium">Tipo di partita</label>
          <select id="tipo_partita" value={form.tipo_partita} onChange={(e) => setForm({ ...form, tipo_partita: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded">
            <option value="allenamento">Allenamento</option>
            <option value="torneo">Torneo</option>
            <option value="amichevole">Amichevole</option>
          </select>
        </div>

        <div>
          <label htmlFor="note" className="block mb-1 font-medium">Note</label>
          <textarea id="note" rows={3}
            value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded" />
        </div>

        <div>
          <label htmlFor="altro_campo" className="block mb-1 font-medium">Altro Campo</label>
          <input type="text" id="altro_campo"
            value={form.altro_campo} onChange={(e) => setForm({ ...form, altro_campo: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded" />
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded cursor-pointer">
          Prenota Ora
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Le Tue Prenotazioni Future ({bookings.length})</h3>
        {bookings.length === 0 ? (
          <p>Nessuna prenotazione futura trovata.</p>
        ) : (
          <ul className="space-y-4">
            {bookings.map((b) => (
              <li key={b.id} className="p-4 border border-gray-300 rounded shadow-sm bg-white">
                <p><strong>Campo:</strong> {b.campi?.nome || 'N/D'}</p>
                <p><strong>Quando:</strong> {new Date(b.data_ora).toLocaleString('it-IT')}</p>
                <p><strong>Durata:</strong> {b.durata_min} min</p>
                <p><strong>Stato:</strong> {b.stato}</p>
                {b.sfidante_id && <p>Sfida con: {b.sfidante_email || 'Altro Utente'}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
