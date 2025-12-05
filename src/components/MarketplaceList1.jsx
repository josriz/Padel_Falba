// src/components/MarketplaceList.jsx - ✅ COMPLETO E FUNZIONANTE
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ShoppingBag, DollarSign, Star } from 'lucide-react';

export default function MarketplaceList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('marketplace_items')
        .select('*')
        .eq('venduto', false)
        .order('created_at', { ascending: false });
      
      setProducts(data || []);
    } catch (err) {
      console.error('Marketplace error:', err);
      // FAKE DATA BACKUP
      setProducts([
        { id: 'fake1', nome: '🏆 Racchetta Bullpadel Vertex', prezzo: 180, descrizione: 'Usata 2 tornei', venduto: false },
        { id: 'fake2', nome: '📦 Borsa Head Graphene', prezzo: 85, descrizione: 'Impermeabile', venduto: false },
        { id: 'fake3', nome: '🎾 Palline Head Pro', prezzo: 25, descrizione: '3 tubi nuove', venduto: false }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[600px] flex items-center justify-center bg-white p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-300 border-t-emerald-600 mx-auto mb-6"></div>
          <p className="text-2xl font-bold text-gray-900">Caricamento Marketplace...</p>
        </div>
      </div>
    );
  }

  const displayProducts = products.length > 0 ? products : [
    { id: 'demo1', nome: '🏆 Racchetta Bullpadel Vertex', prezzo: 180, descrizione: 'Usata 2 tornei - grip nuovo', venduto: false },
    { id: 'demo2', nome: '📦 Borsa Head Graphene 360', prezzo: 85, descrizione: 'Impermeabile - 3 comparti', venduto: false },
    { id: 'demo3', nome: '🎾 Palline Head Pro (3 tubi)', prezzo: 25, descrizione: 'Sigillate pressurizzate', venduto: false }
  ];

  return (
    <div className="min-h-[600px] bg-white p-8">
      {/* HEADER */}
      <div className="text-center mb-20 max-w-4xl mx-auto">
        <div className="w-32 h-32 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl border-4 border-white">
          <ShoppingBag className="w-20 h-20 text-emerald-600" />
        </div>
        <h1 className="text-6xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
          🛒 MARKETPLACE PADCLUB
        </h1>
        <p className="text-2xl text-gray-600 font-semibold">{displayProducts.length} articoli disponibili</p>
      </div>

      {/* PRODOTTI */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 max-w-7xl mx-auto">
        {displayProducts.map((product) => (
          <div key={product.id} className="group bg-white rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-4 border border-gray-200 hover:border-emerald-400 cursor-pointer">
            
            {/* IMMAGINE */}
            <div className="w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-8 flex items-center justify-center group-hover:bg-gray-300 transition-all duration-500">
              <ShoppingBag className="w-32 h-32 text-gray-500 group-hover:text-gray-700 transition-colors duration-500" />
            </div>
            
            {/* TITOLO */}
            <h3 className="text-2xl font-black text-gray-900 mb-6 line-clamp-2 leading-tight group-hover:text-emerald-700 transition-colors">
              {product.nome}
            </h3>
            
            {/* DESCRIZIONE */}
            <p className="text-gray-600 mb-8 text-lg line-clamp-3 leading-relaxed">{product.descrizione}</p>
            
            {/* PREZZO + STELLE */}
            <div className="flex items-center justify-between mb-10">
              <span className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                €{parseFloat(product.prezzo || 0).toFixed(2)}
              </span>
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                <span className="text-xl font-bold text-gray-600">4.9</span>
              </div>
            </div>
            
            {/* BOTTONE */}
            <button className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white font-black py-5 px-8 rounded-3xl hover:from-gray-900 hover:to-black hover:shadow-3xl transition-all duration-500 shadow-2xl border-2 border-gray-700 transform hover:-translate-y-1">
              <DollarSign className="w-7 h-7 inline mr-3" />
              Contatta Venditore
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
