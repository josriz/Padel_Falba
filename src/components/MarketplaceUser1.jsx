// src/components/MarketplaceUser.jsx - ✅ SOSTITUITO CON LISTA FUNZIONANTE
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ShoppingBag, DollarSign } from 'lucide-react';

export default function MarketplaceUser() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await supabase
        .from('marketplace_items')  // ✅ Tabella corretta
        .select('*')
        .eq('venduto', false)       // ✅ Solo prodotti disponibili
        .order('created_at', { ascending: false });
      setProducts(data || []);
    } catch (err) {
      console.error('Errore marketplace:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[600px] flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-400 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Caricamento marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[600px] bg-white p-8">
      {/* Header */}
      <div className="text-center mb-12 max-w-4xl mx-auto">
        <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow border border-gray-200">
          <ShoppingBag className="w-12 h-12 text-gray-600" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">🛒 Marketplace PadelClub</h2>
        <p className="text-xl text-gray-600">Scopri attrezzatura da padel usata in vendita</p>
      </div>

      {/* Prodotti */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {products.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <div className="w-32 h-32 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow border border-gray-200">
              <ShoppingBag className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-3xl font-bold text-gray-500 mb-4">Nessun prodotto disponibile</h3>
            <p className="text-xl text-gray-500 mb-8">Torna presto per nuovi annunci!</p>
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-200">
              {/* Immagine */}
              <div className="w-full h-48 bg-gray-100 rounded-xl mb-6 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                {product.immagine_url ? (
                  <img 
                    src={product.immagine_url} 
                    alt={product.nome} 
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <ShoppingBag className="w-20 h-20 text-gray-400 group-hover:text-gray-500" />
                )}
              </div>
              
              {/* Nome */}
              <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 leading-tight">{product.nome}</h3>
              
              {/* Prezzo e Condizione */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-2xl font-bold text-gray-900">€{product.prezzo?.toFixed(2)}</span>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold border border-emerald-200">
                  Disponibile
                </span>
              </div>
              
              {/* Descrizione */}
              {product.descrizione && (
                <p className="text-gray-600 mb-6 line-clamp-2">{product.descrizione}</p>
              )}
              
              {/* Bottone */}
              <button className="w-full bg-gray-100 text-gray-800 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 hover:shadow-md transition-all border border-gray-200 flex items-center justify-center gap-2">
                <DollarSign className="w-5 h-5" />
                Contatta Venditore
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
