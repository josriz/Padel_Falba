// src/components/MarketplaceList.jsx
console.log("### MARKETPLACE LIST CARICATO ###");
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function MarketplaceList() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = role === "admin";

  const demoImages = [
    "https://images.unsplash.com/photo-1583337130417-3346a1be7dee",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    "https://images.unsplash.com/photo-1599058917213-423a9b9b437b",
    "https://images.unsplash.com/photo-1606813908898-7e5db4ef3de2"
  ];

    useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("marketplace_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      const itemsWithImages = (data || []).map((item, index) => ({
        ...item,
        immagine_url:
          item.immagine_url && item.immagine_url.trim() !== ""
            ? item.immagine_url
            : demoImages[index % demoImages.length],
      }));

      setItems(itemsWithImages);
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Eliminare questo articolo?")) return;

    const { error } = await supabase
      .from("marketplace_items")
      .delete()
      .eq("id", id);

    if (!error) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin h-10 w-10 border-4 border-emerald-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 space-y-6">

        {/* BOTTONE INDIETRO */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-3 py-1.5 rounded-md border border-gray-300 text-sm bg-white hover:bg-gray-50"
        >
          ← Indietro
        </button>

        {/* HEADER */}
        <div className="text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <ShoppingCart className="w-9 h-9 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
          <p className="text-gray-600">{items.length} articoli</p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden"
            >
              <div className="relative h-48">
                <img
                  src={item.immagine_url}
                  alt={item.nome}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 right-2 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  €{item.prezzo}
                </span>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-lg mb-1">{item.nome}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {item.descrizione || "Nessuna descrizione"}
                </p>

                <button className="mt-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Acquista
                </button>

                {isAdmin && (
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="mt-3 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Elimina
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
