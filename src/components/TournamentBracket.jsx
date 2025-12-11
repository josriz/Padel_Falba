// src/components/TournamentBracket.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthProvider";
import { Users, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TournamentBracket({ tournamentId }) {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  console.log(
    "TournamentBracket render - isAdmin:",
    isAdmin,
    "tournamentId:",
    tournamentId
  );

  const [participants, setParticipants] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBracket, setLoadingBracket] = useState(false);
  const [editingResult, setEditingResult] = useState({});
  const [editingTeams, setEditingTeams] = useState({});
  const [draggingPlayerId, setDraggingPlayerId] = useState(null);

  // Carico partecipanti + match
  useEffect(() => {
    const fetchAll = async () => {
      if (!tournamentId) {
        console.error("Errore: tournamentId non definito!");
        setLoading(false);
        return;
      }

      try {
        // partecipanti
        const { data: regs, error: regsError } = await supabase
          .from("tournament_registrations_with_user")
          .select("tournament_id, user_id, email, first_name, last_name")
          .eq("tournament_id", tournamentId);

        if (regsError) {
          console.error("Errore registrazioni:", regsError);
          setParticipants([]);
        } else {
          setParticipants(regs || []);
        }

        // match
        const { data: matchData, error: matchError } = await supabase
          .from("matches")
          .select("*")
          .eq("tournament_id", tournamentId)
          .in("round", ["ottavi", "quarti", "semifinale", "finale"])
          .order("round", { ascending: true })
          .order("court", { ascending: true });

        if (matchError) {
          console.error("Errore caricamento matches:", matchError);
          setMatches([]);
        } else {
          setMatches(matchData || []);
        }
      } catch (err) {
        console.error("Errore fetchAll:", err);
        setParticipants([]);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [tournamentId]);

  // Helper mostrare nome da user_id
  const getPlayerName = (userId) => {
    const p = participants.find((x) => x.user_id === userId);
    if (!p) return userId;
    const full = `${p.first_name || ""} ${p.last_name || ""}`.trim();
    return full ? `${full} (${p.email})` : p.email || userId;
  };

  // "uuid1,uuid2" -> [uuid1, uuid2]
  const parseTeam = (teamStr) => {
    if (!teamStr) return [];
    return teamStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  };

  // Visualizza coppia
  const renderTeam = (teamStr) => {
    const ids = parseTeam(teamStr);
    if (ids.length === 0) return "-";
    if (ids.length === 1) return getPlayerName(ids[0]);
    return `${getPlayerName(ids[0])} / ${getPlayerName(ids[1])}`;
  };

  // Genera tabellone (4/8/16) via RPC generate_bracket
  const handleGenerateBracket = async () => {
    if (!isAdmin) return;

    if (participants.length < 4) {
      alert("Servono almeno 4 giocatori.");
      return;
    }

    setLoadingBracket(true);
    try {
      const { error } = await supabase.rpc("generate_bracket", {
        p_tournament_id: tournamentId,
      });

      if (error) {
        console.error("Errore RPC generate_bracket:", error);
        alert("Errore nella generazione del tabellone: " + error.message);
        return;
      }

      const { data: matchData, error: matchError } = await supabase
        .from("matches")
        .select("*")
        .eq("tournament_id", tournamentId)
        .in("round", ["ottavi", "quarti", "semifinale", "finale"])
        .order("round", { ascending: true })
        .order("court", { ascending: true });

      if (matchError) {
        console.error("Errore ricaricando matches:", matchError);
        alert("Tabellone generato ma errore nel ricaricare i match.");
      } else {
        setMatches(matchData || []);
        alert("Tabellone generato!");
      }
    } catch (err) {
      console.error("Errore handleGenerateBracket:", err);
      alert("Errore imprevisto nella generazione del tabellone");
    } finally {
      setLoadingBracket(false);
    }
  };

  // Elimina tutti i match di questo torneo
  const handleDeleteBracket = async () => {
    if (!isAdmin) return;

    const conferma = window.confirm(
      "Sei sicuro di voler eliminare tutti i match di questo torneo?"
    );
    if (!conferma) return;

    const { error } = await supabase
      .from("matches")
      .delete()
      .eq("tournament_id", tournamentId);

    if (error) {
      console.error("Errore eliminazione tabellone:", error);
      alert("Errore eliminazione tabellone: " + error.message);
      return;
    }

    setMatches([]);
    alert("Tabellone eliminato.");
  };

  // Aggiungi giocatore al team (drag & drop)
  const addPlayerToTeam = async (match, teamKey) => {
    if (!draggingPlayerId) return;

    const currentTeam = parseTeam(match[teamKey]);
    if (currentTeam.includes(draggingPlayerId)) return;
    if (currentTeam.length >= 2) {
      alert("Ogni squadra può avere al massimo 2 giocatori.");
      return;
    }

    const newTeam = [...currentTeam, draggingPlayerId];
    const newTeamStr = newTeam.join(",");

    const payload =
      teamKey === "player1"
        ? { player1: newTeamStr }
        : { player2: newTeamStr };

    const { error } = await supabase
      .from("matches")
      .update(payload)
      .eq("id", match.id);

    if (error) {
      console.error("Errore aggiornando team:", error);
      alert("Errore aggiornando la squadra: " + error.message);
      return;
    }

    const { data: matchData, error: matchError } = await supabase
      .from("matches")
      .select("*")
      .eq("tournament_id", tournamentId)
      .in("round", ["ottavi", "quarti", "semifinale", "finale"])
      .order("round", { ascending: true })
      .order("court", { ascending: true });

    if (!matchError) {
      setMatches(matchData || []);
    }
  };

  // Salvataggio risultato
  const handleSaveResult = async (match) => {
    const edit = editingResult[match.id] || {};
    const newScore = edit.score ?? match.score ?? "";
    const newWinner = edit.winner ?? match.winner ?? "";

    const { error } = await supabase
      .from("matches")
      .update({ score: newScore, winner: newWinner })
      .eq("id", match.id);

    if (error) {
      console.error("Errore salvataggio risultato:", error);
      alert("Errore salvataggio risultato: " + error.message);
      return;
    }

    const { data: matchData, error: matchError } = await supabase
      .from("matches")
      .select("*")
      .eq("tournament_id", tournamentId)
      .in("round", ["ottavi", "quarti", "semifinale", "finale"])
      .order("round", { ascending: true })
      .order("court", { ascending: true });

    if (!matchError) {
      setMatches(matchData || []);
      alert("Risultato salvato!");
    }
  };

  // Salvataggio squadre via select (opzione alternativa)
  const handleSaveTeams = async (match) => {
    const edit = editingTeams[match.id];
    if (!edit || edit.team1Ids?.length !== 2 || edit.team2Ids?.length !== 2) {
      alert("Seleziona esattamente 2 giocatori per ogni squadra.");
      return;
    }

    const team1Str = `${edit.team1Ids[0]},${edit.team1Ids[1]}`;
    const team2Str = `${edit.team2Ids[0]},${edit.team2Ids[1]}`;

    const { error } = await supabase
      .from("matches")
      .update({ player1: team1Str, player2: team2Str })
      .eq("id", match.id);

    if (error) {
      console.error("Errore salvataggio squadre:", error);
      alert("Errore salvataggio squadre: " + error.message);
      return;
    }

    const { data: matchData, error: matchError } = await supabase
      .from("matches")
      .select("*")
      .eq("tournament_id", tournamentId)
      .in("round", ["ottavi", "quarti", "semifinale", "finale"])
      .order("round", { ascending: true })
      .order("court", { ascending: true });

    if (!matchError) {
      setMatches(matchData || []);
      alert("Squadre aggiornate!");
    }
  };

  const MatchCard = ({ match }) => {
    const editRes = editingResult[match.id] || {};
    const editTeams = editingTeams[match.id] || {
      team1Ids: [],
      team2Ids: [],
    };

    const isFirstRound =
      match.round === "ottavi" || match.round === "quarti";

    return (
      <div className="border p-2 rounded mb-2 bg-white shadow-sm">
        <div className="text-xs text-gray-500 mb-1 flex justify-between">
          <span>{match.court || "-"}</span>
          <span>{match.round}</span>
        </div>

        {/* Squadra 1 */}
        <div
          className={`font-semibold rounded px-1 py-0.5 ${
            isFirstRound && isAdmin
              ? "border border-dashed border-emerald-400 min-h-[32px]"
              : ""
          }`}
          onDragOver={(e) => {
            if (isFirstRound && isAdmin && draggingPlayerId) e.preventDefault();
          }}
          onDrop={async (e) => {
            e.preventDefault();
            if (isFirstRound && isAdmin && draggingPlayerId) {
              await addPlayerToTeam(match, "player1");
            }
          }}
        >
          {renderTeam(match.player1)}
        </div>

        <div className="text-center text-sm text-gray-400 my-1">vs</div>

        {/* Squadra 2 */}
        <div
          className={`font-semibold rounded px-1 py-0.5 ${
            isFirstRound && isAdmin
              ? "border border-dashed border-emerald-400 min-h-[32px]"
              : ""
          }`}
          onDragOver={(e) => {
            if (isFirstRound && isAdmin && draggingPlayerId) e.preventDefault();
          }}
          onDrop={async (e) => {
            e.preventDefault();
            if (isFirstRound && isAdmin && draggingPlayerId) {
              await addPlayerToTeam(match, "player2");
            }
          }}
        >
          {renderTeam(match.player2)}
        </div>

        {/* Risultato visibile */}
        {match.score && (
          <div className="mt-1 text-xs text-gray-700">
            Risultato: {match.score}
          </div>
        )}
        {match.winner && (
          <div className="text-xs text-emerald-700">
            Vincitore:{" "}
            {match.winner === "player1"
              ? renderTeam(match.player1)
              : renderTeam(match.player2)}
          </div>
        )}

        {/* Admin: risultato + modifica squadre via select */}
        {isAdmin && (
          <div className="mt-3 space-y-3 text-xs border-t pt-2">
            {/* Risultato */}
            <div>
              <div className="font-semibold mb-1">Risultato</div>
              <input
                type="text"
                defaultValue={match.score || ""}
                placeholder="Es: 6-3 4-6 10-6"
                className="w-full border rounded px-1 py-0.5 mb-1"
                onChange={(e) =>
                  setEditingResult((prev) => ({
                    ...prev,
                    [match.id]: {
                      ...(prev[match.id] || {}),
                      score: e.target.value,
                    },
                  }))
                }
              />
              <select
                defaultValue={match.winner || ""}
                className="w-full border rounded px-1 py-0.5 mb-1"
                onChange={(e) =>
                  setEditingResult((prev) => ({
                    ...prev,
                    [match.id]: {
                      ...(prev[match.id] || {}),
                      winner: e.target.value,
                    },
                  }))
                }
              >
                <option value="">Seleziona vincitore</option>
                <option value="player1">Vince squadra 1</option>
                <option value="player2">Vince squadra 2</option>
              </select>
              <button
                className="w-full bg-blue-600 text-white rounded px-1 py-0.5"
                onClick={() => handleSaveResult(match)}
              >
                Salva risultato
              </button>
            </div>

            {/* Modifica squadre via select */}
            <div>
              <div className="font-semibold mb-1">
                Modifica squadre (2 per team)
              </div>

              <label className="block mb-1 text-[11px]">
                Squadra 1 (scegli 2)
              </label>
              <select
                multiple
                value={editTeams.team1Ids}
                className="w-full border rounded px-1 py-0.5 mb-1 h-16"
                onChange={(e) => {
                  const opts = Array.from(
                    e.target.selectedOptions
                  ).map((o) => o.value);
                  setEditingTeams((prev) => ({
                    ...prev,
                    [match.id]: {
                      ...(prev[match.id] || {}),
                      team1Ids: opts.slice(0, 2),
                    },
                  }));
                }}
              >
                {participants.map((p) => (
                  <option key={p.user_id} value={p.user_id}>
                    {getPlayerName(p.user_id)}
                  </option>
                ))}
              </select>

              <label className="block mb-1 text-[11px]">
                Squadra 2 (scegli 2)
              </label>
              <select
                multiple
                value={editTeams.team2Ids}
                className="w-full border rounded px-1 py-0.5 mb-1 h-16"
                onChange={(e) => {
                  const opts = Array.from(
                    e.target.selectedOptions
                  ).map((o) => o.value);
                  setEditingTeams((prev) => ({
                    ...prev,
                    [match.id]: {
                      ...(prev[match.id] || {}),
                      team2Ids: opts.slice(0, 2),
                    },
                  }));
                }}
              >
                {participants.map((p) => (
                  <option key={p.user_id} value={p.user_id}>
                    {getPlayerName(p.user_id)}
                  </option>
                ))}
              </select>

              <button
                className="w-full bg-amber-600 text-white rounded px-1 py-0.5"
                onClick={() => handleSaveTeams(match)}
              >
                Salva squadre
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="animate-spin mr-2" /> Caricamento...
      </div>
    );
  }

  if (participants.length === 0) {
    return <div className="p-4 text-gray-500">Nessun partecipante trovato</div>;
  }

  const ottavi = matches.filter((m) => m.round === "ottavi");
  const quarti = matches.filter((m) => m.round === "quarti");
  const semifinali = matches.filter((m) => m.round === "semifinale");
  const finale = matches.filter((m) => m.round === "finale");

  return (
    <div className="space-y-6">
      {/* Top bar con bottone Indietro */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-3 py-1.5 rounded-md border border-gray-300 text-sm bg-white hover:bg-gray-50"
        >
          ← Indietro
        </button>
        <h2 className="font-bold text-lg">Tabellone torneo</h2>
      </div>

      {/* Lista iscritti con drag per admin */}
      <div>
        <h3 className="font-bold mb-2">Iscritti</h3>
        <div className="grid grid-cols-1 gap-2">
          {participants.map((p) => (
            <div
              key={p.user_id}
              className="flex items-center border p-2 rounded shadow-sm cursor-move"
              draggable={isAdmin}
              onDragStart={() => setDraggingPlayerId(p.user_id)}
              onDragEnd={() => setDraggingPlayerId(null)}
            >
              <Users className="mr-2 w-4 h-4" />
              <span>
                {p.first_name || p.last_name
                  ? `${p.first_name || ""} ${p.last_name || ""} (${p.email})`
                  : p.email || `User ID: ${p.user_id}`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottoni admin */}
      {isAdmin && (
        <div className="mt-4 flex gap-2 flex-wrap">
          <button
            onClick={handleGenerateBracket}
            disabled={loadingBracket}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg font-bold shadow"
          >
            {loadingBracket ? "Genero..." : "Genera tabellone"}
          </button>

          <button
            onClick={handleDeleteBracket}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow"
          >
            Elimina tabellone
          </button>
        </div>
      )}

      {/* Tabellone */}
      <div className="mt-6">
        {ottavi.length === 0 &&
        quarti.length === 0 &&
        semifinali.length === 0 &&
        finale.length === 0 ? (
          <div className="text-gray-500">
            Nessun match ancora generato. Usa il bottone sopra come admin.
          </div>
        ) : (
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Ottavi</h3>
              {ottavi.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
            <div>
              <h3 className="font-semibold mb-2">Quarti</h3>
              {quarti.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
            <div>
              <h3 className="font-semibold mb-2">Semifinali</h3>
              {semifinali.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
            <div>
              <h3 className="font-semibold mb-2">Finale</h3>
              {finale.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
