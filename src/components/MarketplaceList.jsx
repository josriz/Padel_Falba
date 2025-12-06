// src/components/MarketplaceList.jsx - ✅ AGGIUNGI + CONTATTA (WHATSAPP) + 3 ARTICOLI VISIBILI!
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthProvider';
import { ShoppingBag, DollarSign, Clock, Search, Filter, Plus, X } from 'lucide-react';

export default function MarketplaceList() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({ nome: '', descrizione: '', prezzo: '', immagine_url: '' });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_items')
        .select('*')
        .eq('venduto', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setItems(data || []);
      console.log('✅ Marketplace items caricati:', data?.length || 0);
    } catch (error) {
      console.error('Errore marketplace:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ AGGIUNGI ARTICOLO
  const addItem = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('marketplace_items')
        .insert({
          nome: newItem.nome,
          descrizione: newItem.descrizione,
          prezzo: parseFloat(newItem.prezzo),
          immagine_url: newItem.immagine_url,
          user_id: user.id,
          venduto: false
        })
        .select()
        .single();

      if (error) throw error;
      setItems([data, ...items]);
      setShowAddModal(false);
      setNewItem({ nome: '', descrizione: '', prezzo: '', immagine_url: '' });
      console.log('✅ Articolo aggiunto!');
    } catch (error) {
      console.error('Errore aggiunta:', error);
      alert('Errore: ' + error.message);
    }
  };

  // ✅ CONTATTA VENDITORE via WhatsApp
  const contactSeller = (item) => {
    const message = `Ciao! Interessato "${item.nome}" (€${item.prezzo})\n${item.descrizione || ''}\nHai disponibilità?`;
    window.open(`https://wa.me/393331234567?text=${encodeURIComponent(message)}`, '_blank');
  };

  // ✅ SEGNA VENDUTO (solo propri articoli)
  const markAsSold = async (id) => {
    if (!confirm('Segnare come venduto?')) return;
    
    try {
      const { error } = await supabase
        .from('marketplace_items')
        .update({ venduto: true })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      fetchItems();
      console.log('✅ Articolo segnato venduto!');
    } catch (error) {
      console.error('Errore:', error);
      alert('Errore: ' + error.message);
    }
  };

  const filteredItems = items.filter(item => 
    item.nome?.toLowerCase().includes(search.toLowerCase()) ||
    item.descrizione?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 max-w-full sm:max-w-4xl md:max-w-6xl lg:max-w-7xl mx-auto space-y-6 md:space-y-8 bg-white min-h-[90vh]">
      {/* HEADER + BUTTON AGGIUNGI */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="text-center lg:text-left flex-1">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-xl mx-auto lg:mx-0 mb-4 flex items-center justify-center shadow-sm border border-gray-200">
            <ShoppingBag className="w-8 h-8 md:w-9 md:h-9 text-gray-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Marketplace</h1>
          <p className="text-base md:text-lg text-gray-600 max-w-md mx-auto lg:mx-0">
            Scopri attrezzature padel usate e nuove in vendita ({filteredItems.length})
          </p>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 sm:px-6 md:px-8 py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2 mx-auto lg:ml-0 text-sm md:text-base whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Aggiungi articolo
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cerca racchette, borse, palline..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all"
            />
          </div>
          <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl border border-gray-200 transition-all w-full sm:w-auto">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* GRID */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse h-80" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 md:py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
          <ShoppingBag className="w-16 h-16 md:w-20 md:h-20 text-gray-400 mx-auto mb-2 sm:mb-4 md:mb-6" />
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Nessun articolo trovato</h3>
          <p className="text-gray-600 mb-3 sm:mb-4 md:mb-2 sm:mb-4 md:mb-6 lg:mb-8">
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
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all hover:-translate-y-1 group">
              {/* IMMAGINE */}
              <div className="w-full h-24 md:h-32 rounded-xl mb-3 md:mb-4 overflow-hidden group-hover:scale-105 transition-transform">
                {item.immagine_url ? (
                  <img src={item.immagine_url} alt={item.nome} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-24 md:h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 md:w-12 md:h-12 text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* TITOLO + PREZZO */}
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 md:mb-3 line-clamp-2 leading-tight">{item.nome}</h3>
              
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <span className="text-lg md:text-xl font-black text-gray-900">€{parseFloat(item.prezzo)?.toFixed(2)}</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-bold border border-gray-200">
                  Disponibile
                </span>
              </div>

              {/* DESCRIZIONE + DATA */}
              {item.descrizione && (
                <p className="text-sm text-gray-600 mb-3 md:mb-4 line-clamp-2">{item.descrizione}</p>
              )}
              
              <div className="flex items-center text-xs md:text-sm text-gray-500 mb-4">
                <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0" />
                <span>{new Date(item.created_at).toLocaleDateString('it-IT')}</span>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => contactSeller(item)}
                  className="w-full py-2 md:py-3 px-3 md:px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-sm transition-all text-xs md:text-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.197-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.654-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.173.198-.297.297-.495.099-.198.05-.371-.025-.52-.075-.148-.67-1.611-.918-2.206-.242-.579-.487-.5-.67-.51l-.57-.01c-.197 0-.52.074-.793.371s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.626.712.227 1.36.195 1.872.118.571-.085 1.758-.718 2.006-1.412.248-.694.248-1.29.173-1.412-.074-.123-.272-.198-.57-.347z"/>
                  </svg>
                  Contatta venditore
                </button>
                
                {item.user_id === user?.id && (
                  <button
                    onClick={() => markAsSold(item.id)}
                    className="w-full py-2 md:py-3 px-3 md:px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-sm transition-all text-xs md:text-sm"
                  >
                    Segna venduto
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL AGGIUNGI ARTICOLO */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 md:p-3 sm:p-4 md:p-6 lg:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-2 sm:mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Aggiungi Articolo</h2>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="p-2 hover:bg-gray-100 rounded-xl transition-all"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={addItem} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nome*</label>
                <input
                  required
                  value={newItem.nome}
                  onChange={(e) => setNewItem({...newItem, nome: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all"
                  placeholder="Es: Racchetta Bullpadel Hack"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Prezzo (€)*</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={newItem.prezzo}
                  onChange={(e) => setNewItem({...newItem, prezzo: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all"
                  placeholder="150.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Descrizione</label>
                <textarea
                  rows="3"
                  value={newItem.descrizione}
                  onChange={(e) => setNewItem({...newItem, descrizione: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 focus:border-transparent resize-vertical transition-all"
                  placeholder="Condizioni, marca, modello, misure..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">URL Immagine (opzionale)</label>
                <input
                  type="url"
                  value={newItem.immagine_url}
                  onChange={(e) => setNewItem({...newItem, immagine_url: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all"
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

