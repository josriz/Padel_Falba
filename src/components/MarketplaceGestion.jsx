// src/components/MarketplaceGestion.jsx - AGGIUNTO UPLOAD FOTO + SHOPPINGCART + PULSANTE ELIMINA
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../supabaseClient';
import { ShoppingCart, CheckCircle, XCircle, Edit3, Trash2 } from 'lucide-react';

export default function MarketplaceGestion() {
  const { user, isAdmin, isSuperAdmin } = useAuth();

  const canManageAll = isAdmin || isSuperAdmin;

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
  const [imageFile, setImageFile] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchUserItems();
  }, [user]);

  const fetchUserItems = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const query = supabase
        .from('marketplace_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (!canManageAll) query.eq('user_id', user.id);

      const { data, error } = await query;
      if (error) throw error;
      setUserItems(data);
    } catch (err) {
      setError('Errore nel recupero degli articoli');
      setUserItems([]);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('marketplace')
      .upload(fileName, imageFile, { upsert: true });

    if (uploadError) {
      setError("Errore caricamento immagine");
      return null;
    }

    const url = supabase.storage
      .from('marketplace')
      .getPublicUrl(fileName).data.publicUrl;

    return url;
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
      let imageUrl = newItem.immagine_url;

      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) imageUrl = uploadedUrl;
      }

      const itemData = {
        ...newItem,
        prezzo: parseFloat(newItem.prezzo),
        immagine_url: imageUrl,
        venduto: false,
      };

      let result;

      if (editingItem) {
        result = await supabase
          .from('marketplace_items')
          .update(itemData)
          .eq('id', editingItem.id)
          .select();
      } else {
        result = await supabase
          .from('marketplace_items')
          .insert([{ ...itemData, user_id: user.id }])
          .select();
      }

      if (result.error) {
        setError(result.error.message);
      } else {
        setSuccessMsg(editingItem ? 'Annuncio aggiornato!' : 'Annuncio pubblicato!');
        setNewItem({ nome: '', descrizione: '', prezzo: '', immagine_url: '' });
        setImageFile(null);
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
        .eq('id', itemId);

      if (error) setError('Errore aggiornamento stato');
      else {
        setSuccessMsg(isSold ? 'Articolo marcato come venduto' : 'Articolo rimesso in vendita');
        fetchUserItems();
      }

    } catch {
      setError('Errore di rete');
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const { error } = await supabase
        .from('marketplace_items')
        .delete()
        .eq('id', itemId);

      if (error) setError('Errore eliminazione articolo');
      else {
        setSuccessMsg('Articolo eliminato con successo');
        setUserItems(userItems.filter(item => item.id !== itemId));
      }
    } catch {
      setError('Errore di rete');
    }
  };

  // ✅ wrapper per permessi: solo admin o proprietario
  const deleteWithPermission = async (item) => {
    if (!canManageAll && item.user_id !== user.id) {
      alert('Non hai i permessi per eliminare questo articolo.');
      return;
    }
    await handleDelete(item.id);
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setNewItem({
      nome: item.nome,
      descrizione: item.descrizione,
      prezzo: item.prezzo,
      immagine_url: item.immagine_url
    });
    setImageFile(null);
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setNewItem({ nome: '', descrizione: '', prezzo: '', immagine_url: '' });
    setImageFile(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-[90vh] bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 pt-4 pb-12">
      <div className="p-6 max-w-full sm:max-w-4xl md:max-w-6xl lg:max-w-7xl mx-auto space-y-8">

        <div className="text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-sm border border-gray-200">
            <ShoppingCart className="w-9 h-9 text-emerald-600 drop-shadow-lg" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestione Marketplace</h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">Pubblica e gestisci i tuoi annunci</p>
        </div>

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl max-w-md mx-auto">
            <CheckCircle className="w-5 h-5 inline mr-2" />
            {successMsg}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl max-w-md mx-auto">
            <XCircle className="w-5 h-5 inline mr-2" />
            {error}
          </div>
        )}

        {/* FORM ANNUNCIO */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Nome *</label>
                <input
                  name="nome"
                  value={newItem.nome}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Prezzo (€) *</label>
                <input
                  name="prezzo"
                  type="number"
                  step="0.01"
                  value={newItem.prezzo}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Descrizione</label>
              <textarea
                name="descrizione"
                rows={3}
                value={newItem.descrizione}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">URL Immagine (opzionale)</label>
              <input
                name="immagine_url"
                type="url"
                value={newItem.immagine_url}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Oppure carica immagine dal dispositivo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all"
              >
                {loading ? 'Caricamento...' : (editingItem ? 'Aggiorna Annuncio' : 'Pubblica Annuncio')}
              </button>

              {editingItem && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="py-3 px-6 bg-gray-200 hover:bg-gray-300 rounded-xl font-bold transition-all"
                >
                  Annulla
                </button>
              )}
            </div>

          </form>
        </div>

        {/* LISTA ANNUNCI */}
        <div>
          <h2 className="text-2xl font-bold mb-4">I tuoi annunci ({userItems.length})</h2>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm border animate-pulse">
                  <div className="w-full h-40 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="flex gap-2 pt-4 border-t h-10 bg-gray-200 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userItems.map(item => (
                <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all">

                  {item.immagine_url ? (
                    <img
                      src={item.immagine_url}
                      className="w-full h-40 object-cover rounded-xl mb-4"
                      alt={item.nome}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-40 bg-gray-100 rounded-xl mb-4 flex items-center justify-center ${item.immagine_url ? 'hidden' : ''}`}>
                    <ShoppingCart className="w-10 h-10 text-gray-400 drop-shadow-md" />
                  </div>

                  <h3 className="text-lg font-bold mb-2 line-clamp-2">{item.nome}</h3>

                  <div className="flex justify-between mb-3 items-baseline">
                    <span className="text-2xl font-black text-emerald-600">€{parseFloat(item.prezzo).toFixed(2)}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.venduto ? 'bg-gray-200 text-gray-700' : 'bg-emerald-200 text-emerald-800'}`}>
                      {item.venduto ? 'VENDUTO' : 'DISPONIBILE'}
                    </span>
                  </div>

                  {item.descrizione && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.descrizione}</p>
                  )}

                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={() => handleMarkSold(item.id, !item.venduto)}
                      className={`flex-1 py-2 rounded-xl text-white font-medium transition-all ${
                        item.venduto 
                          ? 'bg-emerald-600 hover:bg-emerald-700' 
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {item.venduto ? 'Rimetti in vendita' : 'Marca venduto'}
                    </button>

                    <button
                      onClick={() => startEdit(item)}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                      title="Modifica"
                    >
                      <Edit3 className="w-4 h-4 text-gray-700" />
                    </button>

                    {/* PULSANTE ELIMINA */}
                    <button
                      onClick={() => deleteWithPermission(item)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all"
                      title="Elimina"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

          {userItems.length === 0 && !loading && (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nessun annuncio</h3>
              <p className="text-gray-600 mb-6">Pubblica il tuo primo articolo!</p>
              <button
                onClick={() => document.querySelector('input[name="nome"]')?.focus()}
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all"
              >
                Crea annuncio
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
