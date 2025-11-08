import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function DashboardUser({ user, isAdmin }) {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newFieldName, setNewFieldName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFields();
  }, []);

  async function fetchFields() {
    setLoading(true);
    const { data, error } = await supabase.from("courts").select("*").order("created_at", { ascending: false });
    if (error) {
      setError(error.message);
    } else {
      setFields(data);
      setError("");
    }
    setLoading(false);
  }

  async function addField() {
    if (!newFieldName.trim()) {
      setError("Inserisci un nome valido");
      return;
    }
    const { error } = await supabase.from("courts").insert([{ name: newFieldName }]);
    if (error) {
      setError(error.message);
    } else {
      setNewFieldName("");
      fetchFields();
    }
  }

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", fontFamily: "Arial, sans-serif" }}>
      <h1>Benvenuto, {user.email}</h1>
      {isAdmin && (
        <p style={{ fontWeight: "bold", color: "green" }}>
          Puoi variare e modificare i dati come amministratore.
        </p>
      )}

      <section style={{ marginTop: 30 }}>
        <h2>Campi Disponibili</h2>
        {loading ? (
          <p>Caricamento campi...</p>
        ) : (
          <ul>
            {fields.map((field) => (
              <li key={field.id}>{field.name}</li>
            ))}
          </ul>
        )}
      </section>

      {isAdmin && (
        <section style={{ marginTop: 30 }}>
          <h2>Aggiungi Nuovo Campo</h2>
          <input
            type="text"
            placeholder="Nome nuovo campo"
            value={newFieldName}
            onChange={(e) => setNewFieldName(e.target.value)}
            style={{ padding: 8, width: "70%", marginRight: 8 }}
          />
          <button onClick={addField} style={{ padding: "8px 16px" }}>
            Aggiungi
          </button>
          {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
        </section>
      )}
    </div>
  );
}
