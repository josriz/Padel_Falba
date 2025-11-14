import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function AdminMarketplace() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ id: null, name: "", description: "", price: "", imageUrl: "" });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setProducts(data);
    setLoading(false);
  }

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  async function handleUpload(e) {
    setUploading(true);
    const file = e.target.files[0];
    if (!file) { setUploading(false); return; }
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
    try {
      const { error } = await supabase.storage.from("product-images").upload(fileName, file);
      if (error) throw error;
      const { publicURL } = supabase.storage.from("product-images").getPublicUrl(fileName);
      setForm({ ...form, imageUrl: publicURL });
    } catch (e) { setError("Upload fallito: " + e.message); }
    setUploading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.price) { setError("Nome e prezzo obbligatori"); return; }
    try {
      if (form.id) {
        const { error } = await supabase.from("products").update({
          name: form.name,
          description: form.description,
          price: form.price,
          image_url: form.imageUrl
        }).eq("id", form.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert({
          name: form.name,
          description: form.description,
          price: form.price,
          image_url: form.imageUrl
        });
        if (error) throw error;
      }
      setForm({ id: null, name: "", description: "", price: "", imageUrl: "" });
      fetchProducts();
    } catch (e) { setError("Errore salvataggio: " + e.message); }
  }

  function handleEdit(product) {
    setForm({ id: product.id, name: product.name, description: product.description, price: product.price, imageUrl: product.image_url || "" });
    setError("");
  }

  async function handleDelete(id) {
    if (!window.confirm("Eliminare questo prodotto?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) setError("Errore eliminazione: " + error.message);
    else fetchProducts();
  }

  return (
    <div style={{ maxWidth: 800, margin: "20px auto", padding: 16 }}>
      <h2>Gestione Prodotti</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input type="text" name="name" placeholder="Nome prodotto" value={form.name} onChange={handleChange} style={{ width: "100%", padding: 8, marginBottom: 8 }} required />
        <textarea name="description" placeholder="Descrizione" value={form.description} onChange={handleChange} style={{ width: "100%", padding: 8, minHeight: 80, marginBottom: 8 }} />
        <input type="number" name="price" placeholder="Prezzo" value={form.price} onChange={handleChange} style={{ width: "100%", padding: 8, marginBottom: 8 }} required />
        <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
        {form.imageUrl && <img src={form.imageUrl} alt="Anteprima" style={{ maxHeight: 150, marginTop: 10, marginBottom: 10 }} />}
        <button type="submit" disabled={uploading} style={{ padding: "10px 20px" }}>{form.id ? "Aggiorna" : "Aggiungi"}</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? <p>Caricamento prodotti...</p> : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {products.map(p => (
            <li key={p.id} style={{ borderBottom: "1px solid #ccc", padding: 10 }}>
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <p>€ {p.price}</p>
              {p.image_url && <img src={p.image_url} alt={p.name} style={{ maxHeight: 120 }} />}
              <div style={{ marginTop: 6 }}>
                <button onClick={() => handleEdit(p)} style={{ marginRight: 10 }}>Modifica</button>
                <button onClick={() => handleDelete(p.id)}>Elimina</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
