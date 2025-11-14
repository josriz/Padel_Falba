import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function Dashboard({ user }) {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newFieldName, setNewFieldName] = useState("");

  // Carica campi da Supabase all’avvio
  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("courts").select("*").order("created_at", { ascending: false });
    if (error) {
      alert("Errore caricamento campi: " + error.message);
    } else {
      setFields(data);
    }
    setLoading(false);
  };

  // Inserisci nuovo campo
  const addField = async () => {
    if (newFieldName.trim() === "") return alert("Inserisci un nome valido");
    const { error } = await supabase.from("courts").insert([{ name: newFieldName }]);
    if (error) {
      alert("Errore inserimento campo: " + error.message);
    } else {
      setNewFieldName("");
      fetchFields(); // aggiorna lista
    }
  };

  // Render
  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>Dashboard</h2>
      <p>Benvenuto {user.email}</p>

      <div>
        <h3>Nuovo Campo</h3>
        <input
          type="text"
          placeholder="Nome campo"
          value={newFieldName}
          onChange={(e) => setNewFieldName(e.target.value)}
          style={{ padding: 8, width: "70%", marginRight: 8 }}
        />
        <button onClick={addField} style={{ padding: "8px 16px" }}>
          Aggiungi
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Campi disponibili</h3>
        {loading ? (
          <p>Caricamento...</p>
        ) : fields.length === 0 ? (
          <p>Nessun campo disponibile</p>
        ) : (
          <ul>
            {fields.map((field) => (
              <li key={field.id}>{field.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
