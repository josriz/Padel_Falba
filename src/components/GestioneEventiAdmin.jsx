import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function GestioneEventiAdmin() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    nome: '',
    descrizione: '',
    data_inizio: '',
    tipo: 'Torneo',
    posti_disponibili: 16,
  });
  const [isEditing, setIsEditing] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('data_inizio', { ascending: false });
      if (error) throw error;
      setEvents(data || []);
      setMessage('');
    } catch (error) {
      console.error("Errore fetch eventi:", error.message);
      setMessage('Errore nel caricamento dei dati di gestione.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === 'number' ? parseInt(value) : value,
    });
  };

  const resetForm = () => {
    setForm({ nome: '', descrizione: '', data_inizio: '', tipo: 'Torneo', posti_disponibili: 16 });
    setIsEditing(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const payload = {
      ...form,
      data_inizio: new Date(form.data_inizio).toISOString(),
    };
    try {
      if (isEditing) {
        const { error: updateError } = await supabase.from('events').update(payload).eq('id', isEditing);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('events').insert([payload]);
        if (insertError) throw insertError;
      }
      setMessage(`✅ Evento ${isEditing ? 'aggiornato' : 'creato'} con successo.`);
      resetForm();
      fetchEvents();
    } catch (error) {
      setMessage(`❌ Errore: ${error.message}`);
    }
  };

  const handleEdit = (event) => {
    const localDate = new Date(event.data_inizio);
    const pad = (n) => (n < 10 ? '0' + n : n);
    const formatForInput = (date) =>
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    setForm({ ...event, data_inizio: formatForInput(localDate) });
    setIsEditing(event.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo evento?")) return;
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (!error) {
      setMessage('🗑️ Evento eliminato con successo.');
      fetchEvents();
    } else {
      setMessage(`❌ Errore nell'eliminazione: ${error.message}`);
    }
  };

  if (loading) return <div className="p-5">Caricamento pannello Admin...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">🛠️ Gestione Eventi e Tornei (Admin)</h2>

      {message && (
        <p
          className={`p-3 mb-6 rounded ${
            message.startsWith('❌') ? 'bg-red-100 text-red-700 border border-red-400' : 'bg-green-100 text-green-700 border border-green-400'
          }`}
        >
          {message}
        </p>
      )}

      <div
        className={`border p-5 rounded mb-8 ${isEditing ? 'bg-yellow-50 border-yellow-400' : 'bg-gray-50 border-gray-300'}`}
      >
        <h3 className="text-xl mb-4">{isEditing ? 'Modifica Evento' : 'Crea Nuovo Evento'}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="nome"
            placeholder="Nome Evento"
            value={form.nome}
            onChange={handleChange}
            required
            className="p-3 rounded border border-gray-300 col-span-full"
          />
          <input
            type="datetime-local"
            name="data_inizio"
            value={form.data_inizio}
            onChange={handleChange}
            required
            className="p-3 rounded border border-gray-300"
          />
          <input
            type="number"
            name="posti_disponibili"
            placeholder="Posti Disponibili"
            value={form.posti_disponibili}
            min="1"
            onChange={handleChange}
            required
            className="p-3 rounded border border-gray-300"
          />
          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            required
            className="p-3 rounded border border-gray-300"
          >
            <option value="Torneo">Torneo</option>
            <option value="Lezione">Lezione</option>
            <option value="Evento Sociale">Evento Sociale</option>
          </select>
          <textarea
            name="descrizione"
            placeholder="Descrizione"
            value={form.descrizione}
            onChange={handleChange}
            rows="3"
            className="p-3 rounded border border-gray-300 col-span-full"
          />

          <div className="col-span-full flex gap-4">
            <button
              type="submit"
              className={`flex-grow py-3 rounded text-white ${
                isEditing ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isEditing ? 'Salva Modifiche' : 'Crea Evento'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="flex-grow py-3 rounded bg-gray-600 hover:bg-gray-700 text-white"
              >
                Annulla
              </button>
            )}
          </div>
        </form>
      </div>

      <h3 className="text-xl font-semibold mb-4">Eventi Creati ({events.length})</h3>
      <ul className="space-y-4">
        {events.length === 0 && <p>Nessun evento ancora creato.</p>}
        {events.map((event) => (
          <li
            key={event.id}
            className="border p-4 rounded bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div>
              <strong>{event.nome}</strong> ({event.tipo}) - {new Date(event.data_inizio).toLocaleString('it-IT')}
              <p className="text-sm text-gray-600 mt-1">Posti: {event.posti_disponibili}</p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <button
                onClick={() => handleEdit(event)}
                className="flex-1 md:flex-none bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
              >
                Modifica
              </button>
              <button
                onClick={() => handleDelete(event.id)}
                className="flex-1 md:flex-none bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Elimina
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
