import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminNews() {
  const [news, setNews] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    const { data, error } = await supabase.from("news").select("*").order("created_at", { ascending: false });
    if (!error) setNews(data);
  };

  const addNews = async () => {
    await supabase.from("news").insert({ title, content });
    setTitle(""); setContent("");
    fetchNews();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Gestione News</h2>
      <div>
        <input placeholder="Titolo" value={title} onChange={e => setTitle(e.target.value)} />
        <textarea placeholder="Contenuto" value={content} onChange={e => setContent(e.target.value)} />
        <button onClick={addNews}>Aggiungi News</button>
      </div>
      <ul>
        {news.map(n => (
          <li key={n.id}><b>{n.title}</b>: {n.content}</li>
        ))}
      </ul>
    </div>
  );
}
