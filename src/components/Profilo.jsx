import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Profilo({ user, onLogout }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user?.id) getProfile();
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
        setUsername(data.username || "");
        setWebsite(data.website || "");
        setAvatarUrl(data.avatar_url || "");
      }
    } catch (error) {
      console.error("Errore caricamento profilo:", error.message);
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
      alert("Profilo aggiornato con successo ✅");
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
      if (!file) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data, error: urlError } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      if (urlError) throw urlError;

      setAvatarUrl(data?.publicUrl || data?.publicURL || "");
    } catch (error) {
      alert("Errore caricamento avatar: " + error.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    if (onLogout) onLogout();
    alert("Logout effettuato correttamente 👋");
  }

  if (!user) {
    return <p>Caricamento utente...</p>;
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        margin: "0 auto",
        padding: "40px 5vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f7f8fa",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
        position: "relative",
      }}
    >
      {/* Bottone Logout */}
      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          backgroundColor: "#e74c3c",
          color: "#fff",
          border: "none",
          borderRadius: 10,
          padding: "10px 16px",
          cursor: "pointer",
          height: 55, // stessa altezza dei bottoni principali
          fontSize: "1.1rem",
        }}
      >
        Logout
      </button>

      <h1 style={{ marginBottom: 20, fontSize: "1.8rem", color: "#333" }}>
        Gestione Profilo
      </h1>

      {loading ? (
        <p>Caricamento dati...</p>
      ) : (
        <form
          onSubmit={updateProfile}
          style={{
            width: "100%",
            maxWidth: 500,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <label style={{ display: "flex", flexDirection: "column", fontSize: "1rem" }}>
            Email (non modificabile):
            <input
              type="text"
              value={user.email || ""}
              disabled
              style={{
                width: "100%",
                marginTop: 6,
                padding: 14,
                borderRadius: 10,
                border: "1px solid #ccc",
                fontSize: "1rem",
                height: 55,
                boxSizing: "border-box",
              }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", fontSize: "1rem" }}>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: "100%",
                marginTop: 6,
                padding: 14,
                borderRadius: 10,
                border: "1px solid #ccc",
                fontSize: "1rem",
                height: 55,
                boxSizing: "border-box",
              }}
              required
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", fontSize: "1rem" }}>
            Website:
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              style={{
                width: "100%",
                marginTop: 6,
                padding: 14,
                borderRadius: 10,
                border: "1px solid #ccc",
                fontSize: "1rem",
                height: 55,
                boxSizing: "border-box",
              }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", fontSize: "1rem" }}>
            Avatar:
            <div style={{ margin: "10px 0", display: "flex", justifyContent: "center" }}>
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="avatar"
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #3498db",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 120,
                    height: 120,
                    backgroundColor: "#ccc",
                    borderRadius: "50%",
                  }}
                ></div>
              )}
            </div>
            <input type="file" accept="image/*" onChange={uploadAvatar} disabled={uploading} />
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              height: 55,
              borderRadius: 10,
              border: "none",
              backgroundColor: "#3498db",
              color: "#fff",
              fontWeight: "600",
              fontSize: "1.1rem",
              cursor: "pointer",
            }}
          >
            {loading ? "Salvando..." : "Salva Profilo"}
          </button>
        </form>
      )}
    </div>
  );
}
