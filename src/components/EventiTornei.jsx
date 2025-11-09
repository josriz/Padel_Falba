import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import BackButton from "./BackButton";

const teamsInit = Array(16).fill("");
const initialMatch = { id: null, aIndex: null, bIndex: null, aScore: null, bScore: null, winner: null, field: "" };

function MatchRow({ type, roundName, matchIndex, match, teamName, onTeamNameChange, onScoreChange, onFieldChange }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
      {onTeamNameChange ? (
        <input
          type="text"
          value={teamName || ""}
          onChange={onTeamNameChange}
          style={{
            flex: 1,
            fontSize: 13,
            padding: 6,
            borderRadius: 12,
            border: "1px solid #ccc",
            transition: "border-color 0.3s",
          }}
          aria-label={`Nome squadra ${type}`}
          onFocus={e => e.currentTarget.style.borderColor = "#4a90e2"}
          onBlur={e => e.currentTarget.style.borderColor = "#ccc"}
        />
      ) : (
        <div style={{ flex: 1, fontSize: 14, padding: 6 }}>{teamName || ""}</div>
      )}
      <input
        type="number"
        min="0"
        value={type === "a" ? match.aScore ?? "" : match.bScore ?? ""}
        onChange={(e) => onScoreChange(roundName, matchIndex, type, e.target.value)}
        style={{
          width: 50,
          padding: 6,
          borderRadius: 12,
          border: "1px solid #ccc",
          textAlign: "center",
          fontSize: 14,
        }}
        aria-label={`Punteggio squadra ${type}`}
      />
      <input
        type="text"
        placeholder="Campo"
        value={match.field}
        onChange={(e) => onFieldChange(roundName, matchIndex, e.target.value)}
        style={{
          width: 80,
          padding: 6,
          borderRadius: 12,
          border: "1px solid #ccc",
          fontSize: 14,
          textAlign: "center",
        }}
      />
    </div>
  );
}

function Stats({ stats }) {
  return (
    <div style={{
      background: "white", padding: 12, borderRadius: 16,
      boxShadow: "0 2px 12px rgba(0,0,0,0.1)", minWidth: 260,
      fontSize: 13,
      color: "#444"
    }}>
      <h3 style={{ marginBottom: 10, fontWeight: "700" }}>Statistiche</h3>
      <div>Squadre partecipanti: {stats.teamsCount}</div>
      <div>Partite giocate: {stats.matchesPlayed}</div>
      <div>Campi usati (manuali): {stats.fieldsUsed.size}</div>
      <h4 style={{ marginTop: 12, fontWeight: "700" }}>Vittorie per squadra</h4>
      <div>
        {Object.entries(stats.wins).sort(([, a], [, b]) => b - a).map(([idx, win], i) => (
          <div key={i}>{idx}: {win} vittorie</div>
        ))}
      </div>
    </div>
  );
}

export default function EventiTornei() {
  const [teams, setTeams] = useState(teamsInit);
  const [eventi, setEventi] = useState([]);
  const [showBracket, setShowBracket] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [message, setMessage] = useState("");
  const [round16, setRound16] = useState([]);
  const [round8, setRound8] = useState([]);
  const [round4, setRound4] = useState([]);
  const [round2, setRound2] = useState([]);
  const [stats, setStats] = useState({ teamsCount: 0, matchesPlayed: 0, fieldsUsed: new Set(), wins: {} });

  useEffect(() => {
    async function loadData() {
      const { data: eventiData, error: eventiError } = await supabase.from("eventi").select("*").order("data", { ascending: false });
      if (!eventiError && eventiData) setEventi(eventiData);

      const { data: partiteData, error: partiteError } = await supabase.from("partite").select("*").eq("turno", "round16");
      if (partiteError) initializeDefaultRounds();
      else if (partiteData.length) setRound16(partiteData.map((r) => ({ ...initialMatch, ...r })));
      else initializeDefaultRounds();

      setRound8(Array(4).fill(null).map(() => ({ ...initialMatch })));
      setRound4(Array(2).fill(null).map(() => ({ ...initialMatch })));
      setRound2([{ ...initialMatch }]);
    }
    loadData();
  }, []);

  const initializeDefaultRounds = () => {
    let r16 = [];
    for (let i = 0; i < 8; i++) r16.push({ ...initialMatch, id: i + 1, aIndex: i * 2, bIndex: i * 2 + 1 });
    setRound16(r16);
  };

  const handleRegisterPlayer = (e) => {
    e.preventDefault();
    const trimmedName = newPlayerName.trim();
    if (!trimmedName) {
      setMessage("Inserisci un nome valido.");
      return;
    }
    const firstEmptyIndex = teams.findIndex((t) => t === "");
    if (firstEmptyIndex === -1) {
      setMessage("Tabellone pieno, iscrizioni chiuse.");
      return;
    }
    const newTeams = [...teams];
    newTeams[firstEmptyIndex] = trimmedName;
    setTeams(newTeams);
    setNewPlayerName("");
    setMessage(`Benvenuto, ${trimmedName}! Sei iscritto al tabellone.`);
  };

  const updateTeamName = (index, name) => {
    const newTeams = [...teams];
    newTeams[index] = name;
    setTeams(newTeams);
  };

  // Gestione vincitori e aggiornamenti punteggi (come nel tuo codice originale)

  return (
    <div style={{ padding: 24, fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif", maxWidth: 1200, margin: "0 auto" }}>
      <BackButton />
      <header style={{ textAlign: "center", marginBottom: 36 }}>
        <h1 style={{ fontSize: 36, color: "#3366cc", fontWeight: "700", textShadow: "0 0 8px #aaccee" }}>
          Torneo Autunnale 2025
        </h1>
        <p style={{ fontSize: "1.2rem", color: "#444", maxWidth: 600, margin: "0 auto", lineHeight: 1.5 }}>
          Unisciti al torneo più atteso della stagione! Inserisci il tuo nome per assicurarti un posto.<br />
          Le modifiche al tabellone sono riservate agli amministratori.
        </p>
      </header>

      <form onSubmit={handleRegisterPlayer} style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Il tuo nome"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          style={{
            padding: 12,
            fontSize: 16,
            borderRadius: 20,
            border: "2px solid #88aaff",
            flexGrow: 1,
            maxWidth: 400,
            boxShadow: "inset 0 0 5px #bbd7ff"
          }}
          aria-label="Nome giocatore"
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#4a90e2",
            borderRadius: 20,
            border: "none",
            padding: "12px 28px",
            fontSize: 16,
            color: "white",
            cursor: "pointer",
            boxShadow: "0 3px 10px #74a9f7",
            transition: "background-color 0.3s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#357ab8"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#4a90e2"}
        >
          Iscriviti
        </button>
      </form>

      {message && (
        <p style={{ textAlign: "center", color: "#3366cc", fontWeight: "600", fontSize: 16, marginBottom: 40 }}>
          {message}
        </p>
      )}

      <button
        onClick={() => setShowBracket(!showBracket)}
        style={{
          display: "block",
          margin: "0 auto 30px",
          padding: "14px 36px",
          fontSize: 18,
          borderRadius: 20,
          backgroundColor: showBracket ? "#e04848" : "#3b99fc",
          border: "none",
          color: "white",
          cursor: "pointer",
          boxShadow: "0 5px 12px rgba(0,0,0,0.15)",
          transition: "background-color 0.3s ease"
        }}
      >
        {showBracket ? "Nascondi Tabellone" : "Visualizza Tabellone"}
      </button>

      {showBracket && (
        <>
          {[{ roundName: "round16", title: "Ottavi (16)", rounds: round16 },
          { roundName: "round8", title: "Quarti (8)", rounds: round8 },
          { roundName: "round4", title: "Semifinali (4)", rounds: round4 }].map(({ roundName, title, rounds }) => (
            <div key={roundName} style={{
              background: "white", padding: 12, borderRadius: 12,
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)", minWidth: 220, maxWidth: 320,
              flex: "1 1 220px", marginBottom: 20
            }}>
              <h3>{title}</h3>
              {rounds.map((m, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <MatchRow
                    type="a"
                    roundName={roundName}
                    matchIndex={i}
                    match={m}
                    teamName={teams[m.aIndex]}
                    onTeamNameChange={roundName === "round16" ? (e) => updateTeamName(m.aIndex, e.target.value) : null}
                    onScoreChange={(rN, mI, side, val) => handleScoreChange(rN, mI, side, val)}
                    onFieldChange={(rN, mI, val) => handleFieldChange(rN, mI, val)}
                  />
                  <MatchRow
                    type="b"
                    roundName={roundName}
                    matchIndex={i}
                    match={m}
                    teamName={teams[m.bIndex]}
                    onTeamNameChange={roundName === "round16" ? (e) => updateTeamName(m.bIndex, e.target.value) : null}
                    onScoreChange={(rN, mI, side, val) => handleScoreChange(rN, mI, side, val)}
                    onFieldChange={(rN, mI, val) => handleFieldChange(rN, mI, val)}
                  />
                  {m.winner !== null && (
                    <div style={{ fontSize: 14, fontWeight: "600", marginTop: 6 }}>
                      Vincitore: {teams[m.winner] || "Sconosciuto"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}

          <div style={{
            background: "white", padding: 12, borderRadius: 12,
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)", minWidth: 220,
            maxWidth: 320, textAlign: "center", marginBottom: 20
          }}>
            <h3>Finale (2)</h3>
            {round2.map((m, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <MatchRow
                  type="a"
                  roundName="round2"
                  matchIndex={i}
                  match={m}
                  teamName={teams[m.aIndex]}
                  onScoreChange={(rN, mI, side, val) => handleScoreChange(rN, mI, side, val)}
                  onFieldChange={(rN, mI, val) => handleFieldChange(rN, mI, val)}
                />
                <MatchRow
                  type="b"
                  roundName="round2"
                  matchIndex={i}
                  match={m}
                  teamName={teams[m.bIndex]}
                  onScoreChange={(rN, mI, side, val) => handleScoreChange(rN, mI, side, val)}
                  onFieldChange={(rN, mI, val) => handleFieldChange(rN, mI, val)}
                />
                {m.winner !== null && (
                  <div style={{ fontSize: 14, fontWeight: "600", marginTop: 6, color: "#28a745" }}>
                    Vincitore: {teams[m.winner] || "Sconosciuto"}
                    <span style={{ marginLeft: 8, fontSize: 18 }}>🏆</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Stats stats={stats} />
        </>
      )}
    </div>
  );
}
