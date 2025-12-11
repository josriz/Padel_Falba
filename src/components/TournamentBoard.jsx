// src/components/TournamentBoard.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function TournamentBoard({ tournamentId }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tournamentId) return;

    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("matches")
        .select("*")
        .eq("tournament_id", tournamentId)
        .in("round", ["ottavi", "quarti", "semifinale", "finale"])
        .order("round", { ascending: true })
        .order("court", { ascending: true });

      if (!error) {
        setMatches(data || []);
      } else {
        console.error("Errore caricamento matches:", error);
        setMatches([]);
      }
      setLoading(false);
    };

    load();
  }, [tournamentId]);

  const byRound = (round) => matches.filter((m) => m.round === round);

  const renderMatchCard = (m) => (
    <div
      key={m.id}
      className="bg-white border border-gray-300 rounded-md px-3 py-2 min-w-[160px] text-center"
    >
      <div className="flex flex-col mb-1">
        <div className="flex justify-center gap-1 my-0.5">
          <div className="px-1 py-0.5 bg-emerald-50 rounded text-xs">
            {m.player1 || "Squadra 1"}
          </div>
        </div>
        <div className="flex justify-center gap-1 my-0.5">
          <div className="px-1 py-0.5 bg-emerald-50 rounded text-xs">
            {m.player2 || "Squadra 2"}
          </div>
        </div>
      </div>

      <div className="mt-1 bg-cyan-50 font-semibold px-1 py-0.5 rounded text-[11px]">
        {m.court ? `Campo ${m.court}` : "Campo -"}
      </div>

      {m.score && (
        <div className="mt-1 bg-amber-50 px-1 py-0.5 rounded text-[11px]">
          {m.score}
        </div>
      )}
    </div>
  );

  if (!tournamentId) return <div>Nessun torneo selezionato.</div>;
  if (loading) return <div>Caricamento tabellone...</div>;
  if (matches.length === 0) return <div>Nessun match generato.</div>;

  return (
    <div className="p-4 bg-[#f8f8f8]">
      <h1 className="text-center text-xl font-bold mb-4">
        Tabellone Padel 2vs2
      </h1>

      <div className="flex flex-col items-center space-y-6">
        <Round title="Ottavi" matches={byRound("ottavi")} render={renderMatchCard} />
        <Round title="Quarti" matches={byRound("quarti")} render={renderMatchCard} />
        <Round title="Semifinali" matches={byRound("semifinale")} render={renderMatchCard} />
        <Round title="Finale" matches={byRound("finale")} render={renderMatchCard} />
      </div>
    </div>
  );
}

function Round({ title, matches, render }) {
  if (matches.length === 0) return null;

  return (
    <div className="w-full max-w-4xl">
      <div className="text-center font-bold mb-2">{title}</div>
      <div className="flex justify-center gap-2 flex-wrap">
        {matches.map(render)}
      </div>
    </div>
  );
}
