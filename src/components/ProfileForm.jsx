// src/components/ProfileForm.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ProfileForm() {
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      setMessage({ type: "error", text: "Devi fare login." });
      setLoading(false);
      return;
    }

    const user = data.user;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    if (!profileError && profile) {
      setFullName(profile.full_name || "");
    }
    setLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      setMessage({ type: "error", text: "Devi fare login." });
      setSaving(false);
      return;
    }

    const user = data.user;

    const { error: upsertError } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName,
      updated_at: new Date().toISOString(),
    });

    if (upsertError) {
      setMessage({ type: "error", text: "Errore salvataggio profilo." });
    } else {
      setMessage({ type: "success", text: "Profilo aggiornato." });
    }
    setSaving(false);
  };

  if (loading) return <p>Caricamento profilo...</p>;

  return (
    <form onSubmit={handleSave} className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="block text-sm font-semibold mb-1">
          Nome e cognome
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>
      <button
        type="submit"
        disabled={saving}
        className="px-4 py-2 rounded bg-blue-600 text-white font-bold"
      >
        {saving ? "Salvataggio..." : "Salva profilo"}
      </button>
      {message && (
        <p
          className={
            message.type === "success" ? "text-green-600" : "text-red-600"
          }
        >
          {message.text}
        </p>
      )}
    </form>
  );
}
