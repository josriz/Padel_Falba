import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { ShoppingBag, Loader, AlertTriangle, User, Clock } from "lucide-react";

const PROFILE_RELATION_NAME = "profiles(full_name, user_id)";

export default function MarketplaceList() {
  const { user, isAdmin, supabase } = useOutletContext();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMarketplaceItems = async () => {
    if (!supabase || !supabase.from) {
      setError("Client DB non inizializzato o non disponibile.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("marketplace_items")
        .select(`
          id, 
          title, 
          description, 
          price, 
          created_at, 
          seller_id,
          ${PROFILE_RELATION_NAME} 
        `)
        .eq("venduto", false)
        .order("created_at", { ascending: false });

      if (error) {
        setError(`Errore fetch articoli Marketplace: ${error.message}. Verifica RLS e Policy.`);
        setLoading(false);
        return;
      }

      setItems(data || []);
    } catch (err) {
      setError("Si è verificata un'eccezione durante il caricamento degli articoli.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (supabase && supabase.from) {
      fetchMarketplaceItems();
    } else {
      setError("Client Supabase non disponibile per l'inizializzazione.");
      setLoading(false);
    }

    if (supabase.channel) {
      const subscription = supabase
        .channel("marketplace_changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "marketplace_items" }, () => {
          fetchMarketplaceItems();
        })
        .subscribe();

      return () => {
        if (subscription) {
          supabase.removeChannel(subscription);
        }
      };
    }
  }, [supabase]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("it-IT", { year: "numeric", month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader className="animate-spin text-indigo-500 w-8 h-8" />
        <p className="ml-3 text-gray-600 dark:text-gray-400">Caricamento articoli...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-center shadow-md dark:bg-red-900 dark:text-red-100">
        <AlertTriangle className="w-6 h-6 mr-3" />
        <p className="font-medium">Errore di Caricamento:</p>
        <p className="ml-2 text-sm">{error}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <ShoppingBag className="w-12 h-12 mx-auto text-indigo-500" />
        <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">Nessun articolo in vendita</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Pubblica il tuo primo oggetto nel Marketplace!</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Marketplace</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Esplora gli articoli usati o nuovi in vendita dalla community.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transform hover:scale-105 transition-transform overflow-hidden dark:bg-gray-800"
          >
            <div className="h-44 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">Placeholder Immagine</p>
            </div>

            <div className="p-5">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white truncate">{item.title}</h2>

              <p className="mt-1 text-indigo-600 font-bold text-2xl">{formatPrice(item.price)}</p>

              <p className="mt-2 text-gray-600 dark:text-gray-400 line-clamp-2">{item.description}</p>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <User className="w-4 h-4 mr-2 text-indigo-400" />
                  <span>Venditore: <strong>{item.profiles?.full_name || "Sconosciuto"}</strong></span>
                </div>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3 mr-2" />
                  <span>Pubblicato il: {formatDate(item.created_at)}</span>
                </div>
              </div>

              <button
                onClick={() => alert(`Visualizza dettaglio per ${item.title}`)}
                className="mt-4 w-full bg-indigo-500 text-white py-2 rounded-lg font-medium hover:bg-indigo-600 transition duration-150"
              >
                Contatta Venditore
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
