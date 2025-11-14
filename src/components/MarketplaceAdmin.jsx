import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function MarketplaceAdmin() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nome: '', prezzo: 0, descrizione: '', condizione: 'Nuovo' });
  const [editingItemId, setEditingItemId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const conditionOptions = ['Nuovo', 'Ottimo', 'Buono', 'Usato'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setMessage('');
    setError(null);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      setError('Accesso negato: Utente non autenticato o sessione scaduta.');
      setLoading(false);
      return;
    }
    setUser(user);

    const { data, error: fetchError } = await supabase.from('articoli_marketplace').select('*').order('created_at', { ascending: false });
    if (fetchError) {
      setError('Impossibile caricare gli articoli del Marketplace.');
      setItems([]);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'prezzo' ? Number(value) : value }));
  };

  const resetForm = () => {
    setForm({ nome: '', prezzo: 0, descrizione: '', condizione: 'Nuovo' });
    setEditingItemId(null);
    setMessage('');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Devi essere autenticato per pubblicare annunci.');
      return;
    }
    const payload = { ...form, user_id: user.id };
    const query = editingItemId
      ? supabase.from('articoli_marketplace').update(payload).eq('id', editingItemId)
      : supabase.from('articoli_marketplace').insert([payload]);

    const { error } = await query;

    if (error) {
      setError(`Errore nel salvataggio: ${error.message}`);
    } else {
      fetchData();
      resetForm();
      setMessage(`✅ Annuncio ${editingItemId ? 'modificato' : 'creato'} con successo!`);
    }
  };

  const handleEdit = (item) => {
    setEditingItemId(item.id);
    setForm({ nome: item.nome, prezzo: item.prezzo, descrizione: item.descrizione, condizione: item.condizione });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo annuncio?")) {
      return;
    }
    const { error } = await supabase.from('articoli_marketplace').delete().eq('id', id);
    if (error) {
      setError(`Errore nell'eliminazione: ${error.message}`);
    } else {
      fetchData();
      setMessage('🗑️ Annuncio eliminato con successo!');
      if (editingItemId === id) resetForm();
    }
  };

  if (loading) return <p className="p-5">Caricamento pannello Admin...</p>;
  if (error && error.includes('Accesso negato')) return <p className="p-5 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Gestione Annunci Marketplace</h1>
      <h3 className={`mb-4 ${editingItemId ? 'text-orange-600' : 'text-green-600'}`}>
        {editingItemId ? 'Modifica Annuncio' : 'Crea Nuovo Annuncio'}
      </h3>
      {message && <p className="text-green-700 border border-green-700 p-3 rounded mb-6">{message}</p>}
      {error && <p className="text-red-700 border border-red-700 p-3 rounded mb-6">{error}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border rounded mb-10">
        <input type="text" name="nome" value={form.nome} onChange={handleFormChange} placeholder="Nome Articolo" required className="p-3 border rounded" />
        <input type="number" name="prezzo" value={form.prezzo} onChange={handleFormChange} placeholder="Prezzo (€)" required min="0" className="p-3 border rounded" />
        <select name="condizione" value={form.condizione} onChange={handleFormChange} required className="p-3 border rounded">
          {conditionOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <textarea name="descrizione" value={form.descrizione} onChange={handleFormChange} placeholder="Descrizione dettagliata" required className="p-3 border rounded" />
        <div className="col-span-full flex gap-4">
          <button type="submit" className={`px-6 py-3 rounded text-white ${editingItemId ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'}`}>
            {editingItemId ? 'Salva Modifiche Annuncio' : 'Pubblica Annuncio'}
          </button>
          {editingItemId && (
            <button type="button" onClick={resetForm} className="px-6 py-3 rounded bg-gray-600 text-white hover:bg-gray-700">
              Annulla Modifica
            </button>
          )}
        </div>
      </form>

      <h3 className="text-2xl mb-4">Annunci Pubblicati ({items.length})</h3>

      <div className="flex flex-col gap-6">
        {items.map(item => (
          <div key={item.id} className="p-4 border rounded bg-gray-50 flex justify-between items-center">
            <div>
              <strong>{item.nome}</strong> | Prezzo: €{item.prezzo} | Condizione: {item.condizione}
              <p className="text-sm text-gray-600 mt-1">ID Annuncio: {item.id}</p>
            </div>
            <div>
              <button onClick={() => handleEdit(item)} className="mr-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Modifica
              </button>
              <button onClick={() => handleDelete(item.id)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Elimina
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
