// src/components/PublicTournamentMatches.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthProvider";

const ROUNDS_ORDER = ["ottavi", "quarti", "semifinale", "finale"];

export default function PublicTournamentMatches({ tournamentId }) {
  const { isAdmin } = useAuth(); // servirà dopo se vuoi mostrare più info ad admin
  const [matches, setMatches] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  // helper per nome giocatore da user_id
  const getPlayerName = (userId) => {
    const p = participants.find((x) => x.user_id === userId);
    if (!p) return userId;
    const full = `${p.first_name || ""} ${p.last_name || ""}`.trim();
    return full || p.email || userId;
  };

  const parseTeam = (teamStr) => {
    if (!teamStr) return [];
    return teamStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const renderTeam = (teamStr) => {
    const ids = parseTeam(teamStr);
    if (ids.length === 0) return "-";
    if (ids.length === 1) return getPlayerName(ids[0]);
    return `${getPlayerName(ids[0])} / ${getPlayerName(ids[1])}`;
  };

  useEffect(() => {
    const load = async () => {
      if (!tournamentId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // iscritti con dati utente (vista che usi già nel bracket)
        const { data: regs } = await supabase
          .from("tournament_registrations_with_user")
          .select("tournament_id, user_id, email, first_name, last_name")
          .eq("tournament_id", tournamentId);

        setParticipants(regs || []);

        const { data: matchData } = await supabase
          .from("matches")
          .select("*")
          .eq("tournament_id", tournamentId);

        setMatches(matchData || []);
      } catch (e) {
        console.error("Errore caricando partite pubbliche:", e);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [tournamentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6 text-gray-600">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Caricamento partite...
      </div>
    );
  }

  if (!matches.length) {
    return (
      <div className="text-center text-gray-500 py-8">
        Nessuna partita ancora generata.
      </div>
    );
  }

  // raggruppa per round secondo l’ordine desiderato
  const matchesByRound = ROUNDS_ORDER.map((round) => ({
    round,
    items: matches.filter((m) => m.round === round),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="space-y-8">
      {matchesByRound.map((group) => (
        <div key={group.round} className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="px-6 py-3 border-b border-gray-100 bg-emerald-50 rounded-t-2xl">
            <h3 className="text-lg font-bold text-emerald-800 uppercase">
              {group.round}
            </h3>
          </div>

          <div className="divide-y divide-gray-100">
            {group.items.map((m) => (
              <div
                key={m.id}
                className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 px-6 py-4 items-center"
              >
                {/* squadra 1 */}
                <div className="text-right md:text-right font-semibold text-gray-900">
                  {renderTeam(m.player1)}
                </div>

                {/* vs */}
                <div className="text-center text-gray-400 text-sm">vs</div>

                {/* squadra 2 */}
                <div className="text-left font-semibold text-gray-900">
                  {renderTeam(m.player2)}
                </div>

                {/* campo */}
                <div className="text-center text-xs md:text-sm text-gray-600">
                  {m.court ? `Campo ${m.court}` : "-"}
                </div>

                {/* risultato */}
                <div className="text-center text-xs md:text-sm text-gray-800">
                  {m.score
                    ? `Risultato: ${m.score}`
                    : "Risultato non ancora disponibile"}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
