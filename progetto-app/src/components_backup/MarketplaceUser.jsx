import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { ShoppingBag, Plus, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthProvider";

export default function MarketplaceUser() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({ nome:'', descrizione:'', prezzo:'', immagine_url:'' });

  useEffect(() => { if (user) fetchProducts(); }, [user]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('marketplace_items').select('*').order('created_at', { ascending: false });
    if (!error) setProducts(data);
    setLoading(false);
  };

  const addProduct = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('marketplace_items').insert({ ...newProduct, prezzo: parseFloat(newProduct.prezzo), user_id: user.id }).select().single();
    if (!error) { setProducts([data, ...products]); setNewProduct({ nome:'', descrizione:'', prezzo:'', immagine_url:'' }); }
    else console.error(error);
  };

  const deleteProduct = async (id) => {
    if (!confirm("Sei sicuro di voler eliminare questo prodotto?")) return;
    const { error } = await supabase.from('marketplace_items').delete().eq('id', id).eq('user_id', user.id);
    if (!error) fetchProducts(); else console.error(error);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Marketplace</h1>

      {/* Form aggiunta */}
      <form onSubmit={addProduct} className="mb-6 flex flex-col gap-2 max-w-md">
        <input required placeholder="Nome" value={newProduct.nome} onChange={e=>setNewProduct({...newProduct,nome:e.target.value})} className="p-2 border rounded" />
        <input required type="number" step="0.01" placeholder="Prezzo" value={newProduct.prezzo} onChange={e=>setNewProduct({...newProduct,prezzo:e.target.value})} className="p-2 border rounded" />
        <input placeholder="Descrizione" value={newProduct.descrizione} onChange={e=>setNewProduct({...newProduct,descrizione:e.target.value})} className="p-2 border rounded" />
        <input placeholder="URL Immagine" value={newProduct.immagine_url} onChange={e=>setNewProduct({...newProduct,immagine_url:e.target.value})} className="p-2 border rounded" />
        <button type="submit" className="bg-green-600 text-white p-2 rounded flex items-center justify-center gap-1"><Plus className="w-4 h-4" /> Aggiungi</button>
      </form>

      {/* Lista prodotti */}
      {loading ? <p>Caricamento...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p.id} className="p-4 border rounded-xl shadow-sm">
              <h3 className="font-bold">{p.nome}</h3>
              <p>€{p.prezzo}</p>
              {p.immagine_url && <img src={p.immagine_url} alt={p.nome} className="h-32 object-cover my-2 rounded" />}
              {p.user_id === user.id && (
                <button onClick={()=>deleteProduct(p.id)} className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"><Trash2 className="w-4 h-4" /> Elimina</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
