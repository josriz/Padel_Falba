import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminNews() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    id: null,
    title: "",
    content: "",
    imageUrl: "",
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Carica lista news da Supabase
  useEffect(() => {
    fetchNews();
  }, []);

  async function fetchNews() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("news").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setNewsList(data);
    } catch (e) {
      console.error("Errore fetch news:", e.message);
    } finally {
      setLoading(false);
    }
  }

  // Gestisci input form
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Upload immagine su Supabase Storage
  async function handleUpload(event) {
    setError("");
    setUploading(true);
    const file = event.target.files[0];
    if (!file) {
      setUploading(false);
      return;
    }
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
    try {
      const { error } = await supabase.storage.from("news-images").upload(fileName, file);
      if (error) throw error;
      const { publicURL, error: urlError } = supabase.storage.from("news-images").getPublicUrl(fileName);
      if (urlError) throw urlError;
      setForm({ ...form, imageUrl: publicURL });
    } catch (e) {
      setError("Upload fallito: " + e.message);
    }
    setUploading(false);
  }

  // Salva o aggiorna news
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.title || !form.content) {
      setError("Titolo e contenuto obbligatori");
      return;
    }
    try {
      if (form.id) {
        // Aggiorna
        const { error } = await supabase.from("news").update({
          title: form.title,
          content: form.content,
          image_url: form.imageUrl,
        }).eq("id", form.id);
        if (error) throw error;
      } else {
        // Inserisci nuovo
        const { error } = await supabase.from("news").insert({
          title: form.title,
          content: form.content,
          image_url: form.imageUrl,
        });
        if (error) throw error;
      }
      setForm({ id: null, title: "", content: "", imageUrl: "" });
      fetchNews();
    } catch (e) {
      setError("Errore salvataggio: " + e.message);
    }
  }

  // Carica dati news in form per modifica
  function handleEdit(news) {
    setForm({
      id: news.id,
      title: news.title,
      content: news.content,
      imageUrl: news.image_url || "",
    });
    setError("");
  }

  // Elimina news
  async function handleDelete(id) {
    if (!window.confirm("Eliminare questa news?")) return;
    try {
      const { error } = await supabase.from("news").delete().eq("id", id);
      if (error) throw error;
      fetchNews();
    } catch (e) {
      setError("Errore eliminazione: " + e.message);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "20px auto", padding: 16 }}>
      <h2>Gestione News</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          type="text"
          name="title"
          placeholder="Titolo"
          value={form.title}
          onChange={handleChange}
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
          required
        />
        <textarea
          name="content"
          placeholder="Contenuto"
          value={form.content}
          onChange={handleChange}
          style={{ width: "100%", padding: 8, minHeight: 100, marginBottom: 8 }}
          required
        />
        <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
        {form.imageUrl && (
          <img
            src={form.imageUrl}
            alt="Anteprima"
            style={{ maxHeight: 150, marginTop: 10, marginBottom: 10, display: "block" }}
          />
        )}
        <button type="submit" disabled={uploading} style={{ padding: "10px 20px" }}>
          {form.id ? "Aggiorna News" : "Aggiungi News"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading ? (
        <p>Caricamento news...</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {newsList.map((news) => (
            <li key={news.id} style={{ borderBottom: "1px solid #ccc", padding: 10 }}>
              <h3>{news.title}</h3>
              <p>{news.content}</p>
              {news.image_url && (
                <img src={news.image_url} alt={news.title} style={{ maxHeight: 120 }} />
              )}
              <div style={{ marginTop: 6 }}>
                <button onClick={() => handleEdit(news)} style={{ marginRight: 10 }}>
                  Modifica
                </button>
                <button onClick={() => handleDelete(news.id)}>Elimina</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
