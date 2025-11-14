import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import BackButton from "./BackButton";

export default function DashboardUser() {
  const [fields, setFields] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [loadingFields, setLoadingFields] = useState(true);
  const [loadingTournaments, setLoadingTournaments] = useState(true);

  // Carica campi
  useEffect(() => {
    fetchFields();
    fetchTournaments();
  }, []);

  const fetchFields = async () => {
    setLoadingFields(true);
    const { data, error } = await supabase.from("courts").select("*").order("created_at", { ascending: false });
    if (error) console.error("Errore campi:", error.message);
    else setFields(data);
    setLoadingFields(false);
  };

  const fetchTournaments = async () => {
    setLoadingTournaments(true);
    const { data, error } = await supabase.from("tournaments").select("*").order("start_date", { ascending: true });
    if (error) console.error("Errore tornei:", error.message);
    else setTournaments(data);
    setLoadingTournaments(false);
  };

  return (
    <div style={{ maxWidth: 720, margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      <BackButton />

      <h2>Campi Disponibili</h2>
      {loadingFields ? <p>Caricamento campi...</p> : fields.length === 0 ? <p>Nessun campo disponibile</p> : (
        <ul>
          {fields.map((field) => (
            <li key={field.id}>{field.name}</li>
          ))}
        </ul>
      )}

      <h2>Tornei & Eventi</h2>
      {loadingTournaments ? <p>Caricamento tornei...</p> : tournaments.length === 0 ? <p>Nessun torneo disponibile</p> : (
        <ul>
          {tournaments.map((t) => (
            <li key={t.id}>
              <strong>{t.name}</strong> - {new Date(t.start_date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}
