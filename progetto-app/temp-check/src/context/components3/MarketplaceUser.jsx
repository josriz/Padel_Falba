// MarketplaceUser.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { ShoppingBag } from "lucide-react";

export default function MarketplaceUser() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("marketplace_items")
        .select("*")
        .eq("venduto", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data);
    } catch (err) {
      console.error("Errore MarketplaceUser:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <div className="p-4">Caricamento...</div>;

  return (
    <div className="p-6">
      <header className="flex items-center mb-6">
        <ShoppingBag className="w-6 h-6 mr-2 text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-800">Marketplace</h1>
      </header>

      {products.length === 0 ? (
        <p>Nessun prodotto disponibile.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((item) => (
            <div key={item.id} className="bg-white shadow rounded p-4">
              <h2 className="text-lg font-semibold">{item.nome}</h2>
              <p className="text-gray-600">{item.descrizione}</p>
              <p className="font-bold text-indigo-600 mt-2">€ {item.prezzo}</p>

              {item.immagine_url && (
                <img
                  src={item.immagine_url}
                  alt={item.nome}
                  className="w-full h-40 object-cover rounded mt-3"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
