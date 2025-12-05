// src/components/MarketplaceGestion.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import PageContainer from './PageContainer';
import { supabase } from '../supabaseClient';
import { ShoppingBag, CheckCircle, XCircle, Edit3 } from 'lucide-react';

export default function MarketplaceGestion() {
  const { user } = useAuth();

  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [newItem, setNewItem] = useState({
    nome: '',
    descrizione: '',
    prezzo: '',
    immagine_url: ''
  });
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchUserItems();
  }, [user]);

  const fetchUserItems = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('marketplace_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setUserItems(data);
    } catch (err) {
      setError('Errore nel recupero degli articoli');
      setUserItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');
    if (!newItem.nome || !newItem.prezzo) {
      setError('Nome e prezzo sono obbligatori!');
      setLoading(false);
      return;
    }
    try {
      const itemData = {
        ...newItem,
        user_id: user.id,
        prezzo: parseFloat(newItem.prezzo),
        venduto: false,
      };
      const { error } = await supabase.from('marketplace_items').insert([itemData]);
      if (error) {
        setError(error.message);
      } else {
        setSuccessMsg('Articolo pubblicato con successo!');
        setNewItem({ nome: '', descrizione: '', prezzo: '', immagine_url: '' });
        setEditingItem(null);
        fetchUserItems();
      }
    } catch {
      setError('Errore di rete');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkSold = async (itemId, isSold) => {
    try {
      const { error } = await supabase
        .from('marketplace_items')
        .update({ venduto: isSold })
        .eq('id', itemId)
        .eq('user_id', user.id);
      if (error) {
        setError('Errore aggiornamento stato');
      } else {
        setSuccessMsg(isSold ? 'Articolo marcato come venduto' : 'Articolo rimesso in vendita');
        fetchUserItems();
      }
    } catch {
      setError('Errore di rete');
    }
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setNewItem({
      nome: item.nome,
      descrizione: item.descrizione,
      prezzo: item.prezzo,
      immagine_url: item.immagine_url
    });
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setNewItem({ nome: '', descrizione: '', prezzo: '', immagine_url: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  return (
    <PageContainer title="Gestione Marketplace">
      <div className="max-w-4xl mx-auto p-8 space-y-12 bg-white rounded-3xl shadow-2xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
            <ShoppingBag className="w-14 h-14 text-gray-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestione Marketplace</h1>
          <p className="text-lg text-gray-600">Pubblica e gestisci i tuoi annunci</p>
        </div>

        {/* Feedback */}
        {successMsg && <div className="bg-green-50 p-4 text-green-700 rounded">{successMsg}</div>}
        {error && <div className="bg-red-50 p-4 text-red-700 rounded">{error}</div>}

        {/* Form Inserimento */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-8 rounded-xl">
          <div>
            <label className="block font-bold mb-1">Nome *</label>
            <input
              name="nome"
              value={newItem.nome}
              onChange={handleChange}
              required
              className="w-full rounded border p-3"
            />
          </div>
          <div>
            <label className="block font-bold mb-1">Prezzo (€) *</label>
            <input
              name="prezzo"
              type="number"
              step="0.01"
              value={newItem.prezzo}
              onChange={handleChange}
              required
              className="w-full rounded border p-3"
            />
          </div>
          <div>
            <label className="block font-bold mb-1">Descrizione</label>
            <textarea
              name="descrizione"
              rows={4}
              value={newItem.descrizione}
              onChange={handleChange}
              className="w-full rounded border p-3"
            />
          </div>
          <div>
            <label className="block font-bold mb-1">URL Immagine</label>
            <input
              name="immagine_url"
              type="url"
              value={newItem.immagine_url}
              onChange={handleChange}
              className="w-full rounded border p-3"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-800 text-white py-3 px-6 rounded hover:bg-gray-900 font-bold disabled:opacity-50"
          >
            {loading ? 'Salvando...' : editingItem ? 'Aggiorna' : 'Pubblica'}
          </button>
          {editingItem && (
            <button
              type="button"
              onClick={cancelEdit}
              className="ml-4 py-3 px-6 rounded border border-gray-800 hover:bg-gray-200 font-bold"
            >
              Annulla
            </button>
          )}
        </form>

        {/* Lista Annunci */}
        <div>
          <h2 className="text-3xl font-bold mb-6">I tuoi annunci ({userItems.length})</h2>
          {loading ? (
            <p>Caricamento in corso...</p>
          ) : userItems.length === 0 ? (
            <p>Nessun annuncio presente.</p>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
              {userItems.map(item => (
                <div key={item.id} className="p-6 border rounded-lg shadow hover:shadow-lg transition">
                  <h3 className="text-xl font-bold mb-2">{item.nome}</h3>
                  <p className="mb-2">Prezzo: €{parseFloat(item.prezzo).toFixed(2)}</p>
                  {item.descrizione && <p className="mb-2">{item.descrizione}</p>}
                  <p className="mb-4 font-semibold">{item.venduto ? '🏷️ Venduto' : 'Disponibile'}</p>
                  <button
                    onClick={() => handleMarkSold(item.id, !item.venduto)}
                    className={`py-2 px-4 rounded ${
                      item.venduto ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    } font-bold`}
                  >
                    {item.venduto ? 'Rimetti in vendita' : 'Marca come venduto'}
                  </button>
                  <button
                    onClick={() => startEdit(item)}
                    className="ml-4 py-2 px-4 rounded border border-gray-700 font-bold hover:bg-gray-100"
                  >
                    Modifica
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
