import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Profilo({ user }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getProfile();
  }, [user]);

  async function getProfile() {
    try {
      setLoading(true);
      const { data, error, status } = await supabase
        .from("profiles")
        .select("username, website, avatar_url")
        .eq("id", user.id)
        .single();

      if (error && status !== 406) throw error;

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert("Errore caricamento profilo: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(event) {
    event.preventDefault();

    try {
      setLoading(true);
      const updates = {
        id: user.id,
        username,
        website,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) throw error;
      alert("Profilo aggiornato con successo");
    } catch (error) {
      alert("Errore aggiornamento profilo: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function uploadAvatar(event) {
    try {
      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { publicURL, error: urlError } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      if (urlError) throw urlError;

      setAvatarUrl(publicURL);
    } catch (error) {
      alert("Errore caricamento avatar: " + error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", fontFamily: "Arial, sans-serif" }}>
      <h1>Gestione Profilo</h1>

      {loading ? (
        <p>Caricamento dati...</p>
      ) : (
        <form onSubmit={updateProfile}>
          <label>
            Email (non modificabile):
            <input type="text" value={user.email} disabled style={{ width: "100%", marginBottom: 10 }} />
          </label>

          <label>
            Username:
            <input
              type="text"
              value={username || ""}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: "100%", marginBottom: 10 }}
              required
            />
          </label>

          <label>
            Website:
            <input
              type="url"
              value={website || ""}
              onChange={(e) => setWebsite(e.target.value)}
              style={{ width: "100%", marginBottom: 10 }}
            />
          </label>

          <label>
            Avatar:
            <div style={{ marginBottom: 10 }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" style={{ width: 100, height: 100, borderRadius: "50%" }} />
              ) : (
                <div style={{ width: 100, height: 100, backgroundColor: "#ccc", borderRadius: "50%" }}></div>
              )}
            </div>
            <input type="file" accept="image/*" onChange={uploadAvatar} disabled={uploading} />
          </label>

          <button type="submit" disabled={loading} style={{ padding: "8px 16px", marginTop: 10 }}>
            {loading ? "Salvando..." : "Salva Profilo"}
          </button>
        </form>
      )}
    </div>
  );
}
