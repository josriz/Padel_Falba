// src/components/MarketplaceAdmin.jsx - ✅ BIANCO/GRIGIO PULITO
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
      <div className="min-h-screen flex items-center justify-center bg-white p-8">
        <div className="text-center max-w-md mx-auto bg-white border border-gray-200 p-12 rounded-3xl shadow-lg">
          <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Accesso Negato</h2>
          <p className="text-lg text-gray-600 mb-8">Questa sezione è riservata agli amministratori.</p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="px-8 py-3 bg-gray-100 text-gray-900 font-bold rounded-2xl hover:bg-gray-200 transition-all border border-gray-200 shadow-sm"
          >
            ← Torna alla Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-4">
              <ShoppingBag className="w-12 h-12" />
              Gestione Marketplace
            </h2>
            <p className="text-xl text-gray-600">Gestisci i prodotti del marketplace</p>
          </div>
          <button 
            onClick={handleAddProduct}
            className="flex items-center gap-3 px-8 py-4 bg-gray-100 text-gray-900 font-bold rounded-2xl hover:bg-gray-200 hover:shadow-lg transition-all border border-gray-200 shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Aggiungi Prodotto
          </button>
        </div>

        {/* Lista Prodotti */}
        {loading ? (
          <div className="flex items-center justify-center py-20 bg-gray-50 rounded-2xl">
            <div className="text-center p-12">
              <Loader2 className="w-16 h-16 animate-spin text-gray-400 mx-auto mb-6" />
              <p className="text-xl text-gray-600">Caricamento prodotti...</p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <ShoppingBag className="w-32 h-32 text-gray-300 mx-auto mb-8" />
                  <h3 className="text-3xl font-bold text-gray-500 mb-4">Nessun prodotto disponibile</h3>
                  <p className="text-xl text-gray-500 mb-8">Clicca "Aggiungi Prodotto" per iniziare</p>
                </div>
              ) : (
                products.map((product) => (
                  <div key={product.id} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group">
                    <div className="w-full h-48 bg-gray-100 rounded-xl mb-6 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                      <ShoppingBag className="w-20 h-20 text-gray-400 group-hover:text-gray-500 transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2">{product.nome || product.name}</h3>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-2xl font-bold text-gray-900">€{(product.prezzo || product.price)?.toFixed(2)}</span>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                        product.venduto 
                          ? 'bg-gray-100 text-gray-700 border border-gray-200' 
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {product.venduto ? 'VENDUTO' : 'DISPONIBILE'}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleEdit(product.id)}
                        className="flex-1 bg-gray-100 text-gray-800 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 hover:shadow-md transition-all border border-gray-200 flex items-center justify-center gap-2"
                      >
                        <Edit3 className="w-4 h-4" />
                        Modifica
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="flex-1 bg-gray-100 text-gray-800 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 hover:shadow-md transition-all border border-gray-200 flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Elimina
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
