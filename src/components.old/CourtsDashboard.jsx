import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function CourtsDashboard() {
  const [courts, setCourts] = useState([]);

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    const { data } = await supabase.from("courts").select("*");
    setCourts(data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Campi Disponibili</h2>
      <ul>
        {courts.map(c => (<li key={c.id}>{c.name}</li>))}
      </ul>
    </div>
  );
}
