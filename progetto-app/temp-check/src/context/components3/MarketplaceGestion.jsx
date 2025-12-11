// MarketplaceGestion.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthProvider";

export default function MarketplaceGestion() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserItems = async () => {
    try {
      if (!user || !user.id) return;

      const { data, error } = await supabase
        .from("marketplace_items")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setItems(data);
    } catch (err) {
      console.error("Errore MarketplaceGestion:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserItems();
  }, [user]);

  if (loading) return <p>Caricamento...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">I miei annunci</h1>

      {items.length === 0 ? (
        <p>Non hai ancora inserito annunci.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white shadow p-4 rounded">
              <h2 className="text-lg font-semibold">{item.nome}</h2>
              <p>{item.descrizione}</p>
              <p className="font-bold mt-2">€ {item.prezzo}</p>

              {item.immagine_url && (
                <img
                  src={item.immagine_url}
                  alt={item.nome}
                  className="w-32 h-32 object-cover rounded mt-3"
                />
              )}

              <p className="text-gray-500 text-sm mt-2">
                Inserito: {new Date(item.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
