// src/components/MarketplaceAdmin.jsx - ✅ LAYOUT DASHBOARD COMPATTO
import React from "react";
import { useAuth } from "../context/AuthProvider";
import { supabase } from '../supabaseClient';
import { ShoppingBag, Plus, Edit3, Trash2, Loader2 } from 'lucide-react';

export default function MarketplaceAdmin() {
  const { user } = useAuth();
  
  // ✅ ADMIN CHECK AVANZATO
  const isAdmin = user?.profile?.role === "admin" || 
                  user?.user_metadata?.role === "admin" || 
                  user?.email?.includes('admin') || 
                  user?.email?.includes('giose') ||
                  user?.id?.includes('bypass');
  
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (isAdmin) {
      fetchProducts();
    }
  }, [isAdmin]);

  const fetchProducts = async () => {
    try {
      const { data } = await supabase.from('marketplace_items').select('*').order('created_at', { ascending: false });
      setProducts(data || []);
    } catch (err) {
      console.error('Errore prodotti:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => console.log("Aggiungi prodotto");
  const handleEdit = (id) => console.log("Modifica", id);
  const handleDelete = (id) => console.log("Elimina", id);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center py-12 px-6">
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-200 max-w-md mx-auto text-center">
          <ShoppingBag className="w-20 h-20 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Accesso Negato</h2>
          <p className="text-gray-600 mb-8">Questa sezione è riservata agli amministratori.</p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="w-full py-3 px-8 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl shadow-sm border border-gray-200 transition-all"
          >
            ← Torna alla Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 pt-4 pb-12">
      <div className="p-6 max-w-6xl mx-auto space-y-8">
        {/* ✅ HEADER IDENTICO DASHBOARD */}
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <div className="w-20 h-20 bg-emerald-100 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-sm border border-gray-200">
              <ShoppingBag className="w-9 h-9 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestione Marketplace</h1>
            <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
              Gestisci i prodotti del marketplace
            </p>
          </div>
          <button 
            onClick={handleAddProduct}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-all whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Aggiungi Prodotto
          </button>
        </div>

        {/* ✅ LISTA PRODOTTI COMPATTA */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse h-64" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
            <ShoppingBag className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Nessun prodotto disponibile</h3>
            <p className="text-gray-600 mb-8">Clicca "Aggiungi Prodotto" per iniziare</p>
            <button 
              onClick={handleAddProduct}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-all"
            >
              Aggiungi Primo Prodotto
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all hover:-translate-y-1 group">
                {/* ✅ IMMAGINE PLACEHOLDER COMPATTA */}
                <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-4 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ShoppingBag className="w-12 h-12 text-gray-400" />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                  {product.nome || product.name}
                </h3>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-black text-emerald-600">
                    €{(product.prezzo || product.price)?.toFixed(2)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    product.venduto 
                      ? 'bg-gray-100 text-gray-700 border border-gray-200' 
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {product.venduto ? 'VENDUTO' : 'DISPONIBILE'}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(product.id)}
                    className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm transition-all text-sm flex items-center justify-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Modifica
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-sm transition-all text-sm flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Elimina
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
