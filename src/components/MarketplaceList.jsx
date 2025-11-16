import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { ShoppingBag, Loader, AlertTriangle, User, Clock } from "lucide-react";
import { supabase } from "../supabaseClient";

const PROFILE_RELATION_NAME = "profiles(full_name)";

export default function MarketplaceList() {
  const { user, isAdmin } = useOutletContext();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const fetchMarketplaceItems = async () => {
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
          venduto,
          seller_id,
          photo_url,
          ${PROFILE_RELATION_NAME}
        `)
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
    fetchMarketplaceItems();

    const subscription = supabase
      .channel("marketplace_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "marketplace_items" }, () => {
        fetchMarketplaceItems();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const formatPrice = (price) =>
    new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(price);
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("it-IT", { year: "numeric", month: "short", day: "numeric" });

  const insertNewProduct = async () => {
    if (!newTitle || !newPrice) return alert("Titolo e prezzo sono obbligatori.");
    const priceNum = parseFloat(newPrice);
    if (isNaN(priceNum)) return alert("Prezzo non valido.");

    const { error } = await supabase.from("marketplace_items").insert([
      {
        title: newTitle,
        description: newDescription,
        price: priceNum,
        seller_id: user.id,
        venduto: false,
        photo_url: newPhotoUrl || null,
      },
    ]);

    if (error) return alert(`Errore inserimento prodotto: ${error.message}`);

    setNewTitle("");
    setNewPrice("");
    setNewDescription("");
    setNewPhotoUrl("");
    fetchMarketplaceItems();
  };

  const toggleVenduto = async (item) => {
    if (!isAdmin && item.seller_id !== user.id) {
      return alert("Non puoi modificare articoli di altri utenti.");
    }

    const { error } = await supabase
      .from("marketplace_items")
      .update({ venduto: !item.venduto })
      .eq("id", item.id);

    if (error) return alert(`Errore aggiornamento stato venduto: ${error.message}`);

    fetchMarketplaceItems();
  };

  const handleFileChange = async (event) => {
    setError(null);
    if (!event.target.files.length) return;
    const file = event.target.files[0];
    if (file.size > MAX_FILE_SIZE) {
      setError("File troppo grande. Massimo 5MB.");
      return;
    }

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/${Date.now()}.${fileExt}`;

    const { data, error: uploadError } = await supabase.storage
      .from("marketplace-photos")
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    setUploading(false);

    if (uploadError) {
      return setError("Errore durante l'upload: " + uploadError.message);
    }

    const { publicURL } = supabase.storage.from("marketplace-photos").getPublicUrl(data.path);
    setNewPhotoUrl(publicURL);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Marketplace</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Esplora gli articoli usati o nuovi in vendita dalla community.
      </p>

      <div className="mb-10 p-5 bg-gray-100 rounded-md shadow dark:bg-gray-700">
        <h2 className="text-xl font-semibold mb-4">Inserisci nuovo prodotto in vendita</h2>

        <input
          type="text"
          placeholder="Titolo"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="text"
          placeholder="Prezzo"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />
        <textarea
          placeholder="Descrizione"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          rows={3}
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {uploading && <p>Caricamento immagine in corso...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {newPhotoUrl && (
          <img src={newPhotoUrl} alt="Anteprima" className="my-2 w-48 h-48 object-cover rounded" />
        )}

        <button
          onClick={insertNewProduct}
          className="bg-indigo-600 text-white py-2 px-4 rounded shadow hover:bg-indigo-700 mt-3"
        >
          Inserisci Prodotto
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <ShoppingBag className="w-12 h-12 mx-auto text-indigo-500" />
          <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
            Nessun articolo in vendita
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Pubblica il tuo primo oggetto nel Marketplace!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transform hover:scale-105 transition-transform overflow-hidden dark:bg-gray-800"
            >
              <div className="h-44 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                {item.photo_url ? (
                  <img
                    src={item.photo_url}
                    alt={item.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">Placeholder Immagine</p>
                )}
              </div>
              <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white truncate">{item.title}</h2>
                <p className="mt-1 text-indigo-600 font-bold text-2xl">{formatPrice(item.price)}</p>
                <p className="mt-2 text-gray-600 dark:text-gray-400 line-clamp-2">{item.description}</p>
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <User className="w-4 h-4 mr-2 text-indigo-400" />
                    <span>
                      Venditore: <strong>{item.profiles?.full_name || "Sconosciuto"}</strong>
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3 mr-2" />
                    <span>Pubblicato il: {formatDate(item.created_at)}</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleVenduto(item)}
                  className="mt-4 w-full bg-indigo-500 text-white py-2 rounded-lg font-medium hover:bg-indigo-600 transition duration-150"
                >
                  {item.venduto ? "Rimuovi Venduto" : "Marca come Venduto"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
