import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

export default function MarketplaceGestion() {
  const { user, supabase } = useOutletContext();
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [newItem, setNewItem] = useState({
    nome: '',
    descrizione: '',
    prezzo: '',
    immagine_url: '',
  });

  const fetchUserItems = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('marketplace_items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      setError("Errore nel recupero dei tuoi articoli. Riprova.");
      setUserItems([]);
    } else {
      setUserItems(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    if (!user || !newItem.nome || !newItem.prezzo) {
      setError("Dati mancanti o utente non loggato.");
      setLoading(false);
      return;
    }

    const itemData = {
      ...newItem,
      user_id: user.id,
      prezzo: parseFloat(newItem.prezzo),
    };

    const { error } = await supabase.from('marketplace_items').insert([itemData]);

    if (error) {
      setError(`Impossibile inserire l'articolo: ${error.message}`);
    } else {
      setSuccessMsg('✅ Articolo inserito con successo!');
      setNewItem({ nome: '', descrizione: '', prezzo: '', immagine_url: '' });
      fetchUserItems();
    }
    setLoading(false);
  };

  const handleMarkSold = async (itemId, isSold) => {
    const { error } = await supabase
      .from('marketplace_items')
      .update({ venduto: isSold })
      .eq('id', itemId)
      .eq('user_id', user.id);

    if (error) {
      setError('Errore nell\'aggiornamento dello stato.');
    } else {
      setSuccessMsg(isSold ? 'Articolo marcato come Venduto!' : 'Articolo rimesso in vendita.');
      fetchUserItems();
    }
  };

  useEffect(() => {
    fetchUserItems();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow max-w-4xl mx-auto">
      <h1 className="text-3xl mb-4 font-bold">✏️ Gestione Articoli Marketplace</h1>
      <p className="text-gray-700 mb-8">Qui puoi inserire nuovi articoli in vendita e gestire i tuoi annunci attuali.</p>

      {successMsg && <p className="text-green-700 bg-green-100 rounded p-3 mb-4">{successMsg}</p>}
      {error && <p className="text-red-700 bg-red-100 rounded p-3 mb-4">{error}</p>}

      <div className="mb-10">
        <h2 className="text-xl mb-4 font-semibold">Inserisci un Nuovo Articolo</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={newItem.nome}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded"
          />
          <input
            type="number"
            name="prezzo"
            placeholder="Prezzo"
            value={newItem.prezzo}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded"
          />
          <textarea
            name="descrizione"
            placeholder="Descrizione"
            value={newItem.descrizione}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="immagine_url"
            placeholder="URL Immagine"
            value={newItem.immagine_url}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white py-3 rounded disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Caricamento...' : 'Pubblica Articolo'}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl mb-4 font-semibold">I Tuoi Annunci ({userItems.length})</h2>
        {loading ? (
          <p>Caricamento tuoi articoli...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {userItems.map((item) => (
              <div
                key={item.id}
                className={`border rounded p-4 ${item.venduto ? 'border-gray-400 opacity-60' : 'border-green-500'}`}
              >
                <h4 className="font-semibold">{item.nome}</h4>
                <p>Prezzo: € {item.prezzo.toFixed(2)}</p>
                <p>Stato: <strong>{item.venduto ? 'Venduto' : 'Attivo'}</strong></p>
                <button
                  onClick={() => handleMarkSold(item.id, !item.venduto)}
                  className={`mt-3 w-full py-2 rounded ${
                    item.venduto ? 'bg-yellow-400 hover:bg-yellow-500 text-black' : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {item.venduto ? 'Rimetti in vendita' : 'Marca come Venduto'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
