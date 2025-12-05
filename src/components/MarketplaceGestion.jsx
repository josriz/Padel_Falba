// src/components/MarketplaceGestion.jsx - ✅ LAYOUT DASHBOARD COMPATTO
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../supabaseClient';
import { ShoppingBag, CheckCircle, XCircle, Edit3, Plus, DollarSign } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 pt-4 pb-12">
      <div className="p-6 max-w-6xl mx-auto space-y-8">
        {/* ✅ HEADER IDENTICO DASHBOARD */}
        <div className="text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-sm border border-gray-200">
            <ShoppingBag className="w-9 h-9 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestione Marketplace</h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
            Pubblica e gestisci i tuoi annunci
          </p>
        </div>

        {/* ✅ FEEDBACK */}
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

        {/* ✅ FORM COMPATTO */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nome *</label>
                <input
                  name="nome"
                  value={newItem.nome}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Es: Racchetta Bullpadel"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Prezzo (€) *</label>
                <input
                  name="prezzo"
                  type="number"
                  step="0.01"
                  value={newItem.prezzo}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Es: 150.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Descrizione</label>
              <textarea
                name="descrizione"
                rows={3}
                value={newItem.descrizione}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical"
                placeholder="Condizioni, marca, modello..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">URL Immagine (opzionale)</label>
              <input
                name="immagine_url"
                type="url"
                value={newItem.immagine_url}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="https://example.com/immagine.jpg"
              />
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 min-w-[140px] py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Salvando...
                  </>
                ) : editingItem ? 'Aggiorna' : 'Pubblica Annuncio'}
              </button>
              {editingItem && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-xl shadow-sm border border-gray-200 transition-all"
                >
                  Annulla
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ✅ LISTA ANNUNCI COMPATTA */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <ShoppingBag className="w-7 h-7 text-emerald-600" />
            I tuoi annunci ({userItems.length})
          </h2>
          
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse h-48" />
              ))}
            </div>
          ) : userItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
              <ShoppingBag className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nessun annuncio</h3>
              <p className="text-gray-600">Pubblica il tuo primo annuncio!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userItems.map(item => (
                <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all hover:-translate-y-1 group">
                  <div className={`w-full h-32 bg-gradient-to-br ${item.venduto ? 'from-gray-100 to-gray-200' : 'from-emerald-50 to-blue-50'} rounded-xl mb-4 flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <ShoppingBag className={`w-12 h-12 ${item.venduto ? 'text-gray-400' : 'text-emerald-400'}`} />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{item.nome}</h3>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-black text-emerald-600">€{parseFloat(item.prezzo).toFixed(2)}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.venduto 
                        ? 'bg-gray-100 text-gray-700 border border-gray-200' 
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {item.venduto ? 'VENDUTO' : 'DISPONIBILE'}
                    </span>
                  </div>
                  
                  {item.descrizione && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.descrizione}</p>
                  )}
                  
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleMarkSold(item.id, !item.venduto)}
                      className={`flex-1 py-2.5 px-3 rounded-xl font-semibold text-sm transition-all ${
                        item.venduto 
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm' 
                          : 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
                      }`}
                    >
                      {item.venduto ? 'Rimetti in vendita' : 'Marca venduto'}
                    </button>
                    <button
                      onClick={() => startEdit(item)}
                      className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl border border-gray-200 transition-all group-hover:shadow-sm"
                      title="Modifica"
                    >
                      <Edit3 className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
