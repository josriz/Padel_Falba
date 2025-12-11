import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { supabase } from "../supabaseClient";
import { Plus, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import TournamentBracket from "./TournamentBracket";

export default function TournamentListAndAdmin() {
  const { isAdmin } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTournaments() {
      setLoading(true);
      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        console.error("Errore tornei:", error);
        setLoading(false);
        return;
      }

      setTournaments(data || []);
      setLoading(false);
    }

    fetchTournaments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <RefreshCw className="animate-spin mr-2" />
        Caricamento tornei...
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tornei</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tournaments.map((t) => (
          <div
            key={t.id}
            className="border p-4 rounded hover:shadow cursor-pointer"
            onClick={() => setSelectedTournament(t.id)}
          >
            <h2 className="text-lg font-semibold">{t.name}</h2>
          </div>
        ))}
      </div>

      {selectedTournament && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Tabellone</h2>
          <TournamentBracket tournamentId={selectedTournament} />
        </div>
      )}
    </div>
  );
}
