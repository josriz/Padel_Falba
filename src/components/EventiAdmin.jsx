import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function EventiAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    date: '',
    description: '',
    max_players: 0,
    fee: 0,
  });
  const [editingEventId, setEditingEventId] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkIfAdmin();
    fetchEvents();
  }, []);

  const checkIfAdmin = async () => {
    const user = supabase.auth.user();
    if (!user) {
      setIsAdmin(false);
      return;
    }
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', user.id)
      .single();
    setIsAdmin(!!data);
  };

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true });
    if (error) {
      setError('Impossibile caricare gli eventi.');
    } else {
      setEvents(data);
      setError(null);
    }
    setLoading(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ['max_players', 'fee'].includes(name) ? Number(value) : value,
    }));
  };

  const resetForm = () => {
    setForm({
      name: '',
      date: '',
      description: '',
      max_players: 0,
      fee: 0,
    });
    setEditingEventId(null);
    setMessage('');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = form;
    const query = editingEventId
      ? supabase.from('events').update(payload).eq('id', editingEventId)
      : supabase.from('events').insert([payload]);

    const { error } = await query;
    if (error) {
      setError(`Errore nel salvataggio: ${error.message}`);
    } else {
      fetchEvents();
      resetForm();
      setMessage(`✅ Evento ${editingEventId ? 'modificato' : 'creato'} con successo!`);
    }
  };

  const handleEdit = (event) => {
    setEditingEventId(event.id);
    const formattedDate = event.date.split('T')[0];
    setForm({
      name: event.name,
      date: formattedDate,
      description: event.description,
      max_players: event.max_players,
      fee: event.fee,
    });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo evento e tutte le sue iscrizioni?')) return;
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) {
      setError(`Errore nell'eliminazione: ${error.message}`);
    } else {
      fetchEvents();
      setMessage('🗑️ Evento eliminato con successo!');
      if (editingEventId === id) resetForm();
    }
  };

  if (loading) return <p className="p-5">Caricamento eventi...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Gestione Eventi e Tornei</h1>

      {isAdmin ? (
        <>
          <h3 className={`mb-6 ${editingEventId ? 'text-orange-600' : 'text-green-600'}`}>
            {editingEventId ? 'Modifica Evento' : 'Crea Nuovo Evento'}
          </h3>

          {message && <p className="text-green-700 border border-green-700 p-3 rounded mb-6">{message}</p>}
          {error && <p className="text-red-700 border border-red-700 p-3 rounded mb-6">{error}</p>}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border rounded mb-10">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              placeholder="Nome Evento"
              required
              className="p-3 border rounded col-span-full"
            />
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleFormChange}
              required
              className="p-3 border rounded"
            />
            <input
              type="number"
              name="max_players"
              value={form.max_players}
              onChange={handleFormChange}
              placeholder="Max Partecipanti"
              required
              min="1"
              className="p-3 border rounded"
            />
            <input
              type="number"
              name="fee"
              value={form.fee}
              onChange={handleFormChange}
              placeholder="Costo Iscrizione (€)"
              required
              min="0"
              className="p-3 border rounded"
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleFormChange}
              placeholder="Descrizione dettagliata"
              required
              className="p-3 border rounded col-span-full"
            />

            <div className="col-span-full flex gap-4">
              <button
                type="submit"
                className={`px-6 py-3 rounded text-white ${editingEventId ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {editingEventId ? 'Salva Modifiche Evento' : 'Crea Evento'}
              </button>
              {editingEventId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 rounded bg-gray-600 text-white hover:bg-gray-700"
                >
                  Annulla Modifica
                </button>
              )}
            </div>
          </form>
        </>
      ) : (
        <p className="text-gray-700 font-semibold">Non sei autorizzato a creare o modificare eventi.</p>
      )}

      <h3 className="text-2xl mb-4">Eventi Pubblicati ({events.length})</h3>
      <div className="flex flex-col gap-6">
        {events.length === 0 && <p>Nessun evento pubblicato.</p>}
        {events.map(event => (
          <div
            key={event.id}
            className="p-4 border rounded bg-gray-50 flex justify-between items-center"
          >
            <div>
              <strong>{event.name}</strong> | Data: {new Date(event.date).toLocaleDateString()}
              <p className="text-sm text-gray-600 mt-1">
                Iscrizione: €{event.fee} | Max partecipanti: {event.max_players}
              </p>
            </div>
            {isAdmin && (
              <div>
                <button
                  onClick={() => handleEdit(event)}
                  className="mr-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Modifica
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  Elimina
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
