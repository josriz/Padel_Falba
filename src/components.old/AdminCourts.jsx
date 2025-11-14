import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminCourts() {
  const [courts, setCourts] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => { fetchCourts(); }, []);

  const fetchCourts = async () => {
    const { data } = await supabase.from("courts").select("*");
    setCourts(data);
  };

  const addCourt = async () => {
    await supabase.from("courts").insert({ name });
    setName("");
    fetchCourts();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Gestione Campi</h2>
      <input placeholder="Nome campo" value={name} onChange={e => setName(e.target.value)} />
      <button onClick={addCourt}>Aggiungi Campo</button>
      <ul>
        {courts.map(c => (<li key={c.id}>{c.name}</li>))}
      </ul>
    </div>
  );
}
