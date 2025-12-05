// src/components/MarketplaceUser.jsx - ✅ UTENTI VEDONO TUTTI + POSSONO INSERIRE!
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ShoppingBag, DollarSign, Search, Filter, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthProvider';

export default function MarketplaceUser() {
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    nome: '',
    descrizione: '',
    prezzo: '',
    immagine_url: ''
  });

  useEffect(() => {
    if (user?.id) fetchProducts();
  }, [user]);

  // ✅ UTENTI VEDONO TUTTI GLI ARTICOLI (NON solo propri!)
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('marketplace_items')
        .select('*')
        .eq('venduto', false)        // Solo disponibili
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Errore marketplace:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ UTENTI POSSONO AGGIUNGERE ARTICOLI
  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('marketplace_items')
        .insert({
          ...newProduct,
          prezzo: parseFloat(newProduct.prezzo),
          user_id: user.id,
          venduto: false
        })
        .select()
        .single();

      if (error) throw error;
      setProducts([data, ...products]);
      setShowAddModal(false);
      setNewProduct({ nome: '', descrizione: '', prezzo: '', immagine_url: '' });
    } catch (err) {
      console.error('Errore aggiunta prodotto:', err);
    }
  };

  // ✅ Solo propri articoli possono essere marcati venduti
  const markAsSold = async (id) => {
    try {
      const { error } = await supabase
        .from('marketplace_items')
        .update({ venduto: true })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      fetchProducts();
    } catch (err) {
      console.error('Errore nel segnare come venduto:', err);
    }
  };

  const filteredProducts = products.filter(product =>
    product.nome?.toLowerCase().includes(search.toLowerCase()) ||
    product.descrizione?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-lg font-semibold text-gray-700">Caricamento marketplace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-4 pb-12">
      <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 md:space-y-8">

        {/* HEADER */}
        <div className="text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-sm border border-gray-200">
            <ShoppingBag className="w-8 h-8 md:w-9 md:h-9 text-gray-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Marketplace</h1>
          <p className="text-base md:text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
            Scopri e vendi attrezzature da padel
          </p>
        </div>

        {/* BUTTON AGGIUNGI + SEARCH */}
        <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex-1 md:flex-none px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm md:text-base"
          >
            <Plus className="w-4 h-4" />
            Aggiungi Articolo
          </button>
          
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cerca articoli..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* GRID */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 md:py-20 bg-white rounded-2xl md:rounded-xl shadow-sm border border-gray-200">
            <ShoppingBag className="w-16 h-16 md:w-20 md:h-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Nessun prodotto trovato</h3>
            <p className="text-gray-600 mb-8">
              {search ? 'Prova con un termine diverso' : 'Sii il primo a mettere in vendita!'}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-8 py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-xl shadow-sm transition-all"
            >
              + Aggiungi il tuo primo articolo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all hover:-translate-y-1 group">
                <div className="w-full h-24 md:h-32 rounded-xl mb-3 md:mb-4 overflow-hidden group-hover:scale-105 transition-transform">
                  {product.immagine_url ? (
                    <img 
                      src={product.immagine_url} 
                      alt={product.nome} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-24 md:h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 md:w-12 md:h-12 text-gray-400" />
                    </div>
                  )}
                </div>

                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 md:mb-3 line-clamp-2 leading-tight">{product.nome}</h3>
                
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <span className="text-lg md:text-xl font-black text-gray-900">€{product.prezzo?.toFixed(2)}</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-bold border border-gray-200">
                    Disponibile
                  </span>
                </div>

                {product.descrizione && (
                  <p className="text-sm text-gray-600 mb-4 md:mb-6 line-clamp-2">{product.descrizione}</p>
                )}

                <div className="flex flex-col gap-2">
                  <button className="w-full py-2 px-3 md:py-3 md:px-4 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-xl shadow-sm transition-all text-xs md:text-sm flex items-center justify-center gap-1 md:gap-2">
                    <DollarSign className="w-3 h-3 md:w-4 md:h-4" />
                    Contatta venditore
                  </button>

                  {/* ✅ Solo propri articoli: segna venduto */}
                  {product.user_id === user.id && (
                    <button
                      onClick={() => markAsSold(product.id)}
                      className="w-full py-2 px-3 md:py-3 md:px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-sm transition-all text-xs md:text-sm flex items-center justify-center gap-1 md:gap-2"
                    >
                      Segna venduto
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ MODAL AGGIUNGI PRODOTTO */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Aggiungi Articolo</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={addProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nome*</label>
                <input
                  type="text"
                  required
                  value={newProduct.nome}
                  onChange={(e) => setNewProduct({...newProduct, nome: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                  placeholder="Es: Palmera Carbono"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Prezzo (€)*</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newProduct.prezzo}
                  onChange={(e) => setNewProduct({...newProduct, prezzo: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                  placeholder="50.00"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Descrizione</label>
                <textarea
                  rows="3"
                  value={newProduct.descrizione}
                  onChange={(e) => setNewProduct({...newProduct, descrizione: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 focus:border-transparent resize-vertical"
                  placeholder="Condizioni, taglia, etc..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">URL Immagine (opzionale)</label>
                <input
                  type="url"
                  value={newProduct.immagine_url}
                  onChange={(e) => setNewProduct({...newProduct, immagine_url: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 focus:border-transparent"
                  placeholder="https://example.com/immagine.jpg"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 px-4 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-xl shadow-sm transition-all"
                >
                  Pubblica
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
