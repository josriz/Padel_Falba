import React, { useState, useEffect } from "react";
import BackButton from "./BackButton";

const teamsInit = [
  "Finale", "Team 2", "Team 3", "Team 4",
  "Team 5", "Team 6", "Team 7", "Team 8",
  "Team 9", "Team 10", "Team 11", "Team 12",
  "Team 13", "Team 14", "Team 15", "Team 16"
];

const initialMatch = { aIndex: null, bIndex: null, aScore: null, bScore: null, winner: null, field: "" };

export default function EventiTornei() {
  const [teams, setTeams] = useState(teamsInit);
  const [round16, setRound16] = useState([]);
  const [round8, setRound8] = useState([]);
  const [round4, setRound4] = useState([]);
  const [round2, setRound2] = useState([]);
  const [stats, setStats] = useState({ teamsCount: 0, matchesPlayed: 0, fieldsUsed: new Set(), wins: {} });

  useEffect(() => {
    let r16 = [];
    for(let i=0; i<8; i++) {
      r16.push({ ...initialMatch, aIndex: i*2, bIndex: i*2+1 });
    }
    setRound16(r16);
    setRound8(Array(4).fill(null).map(() => ({ ...initialMatch })));
    setRound4(Array(2).fill(null).map(() => ({ ...initialMatch })));
    setRound2([ { ...initialMatch } ]);
  }, []);

  const updateTeamName = (index, name) => {
    const newTeams = [...teams];
    newTeams[index] = name;
    setTeams(newTeams);
  };

  const computeWinner = (roundName, matchIndex) => {
    const rounds = { round16, round8, round4, round2 };
    const setRounds = { round16: setRound16, round8: setRound8, round4: setRound4, round2: setRound2 };

    let round = rounds[roundName].slice();
    let match = round[matchIndex];

    if(match.aScore !== null && match.bScore !== null) {
      if(match.aScore > match.bScore) match.winner = match.aIndex;
      else if(match.bScore > match.aScore) match.winner = match.bIndex;
      else match.winner = null;
    } else {
      match.winner = null;
    }

    round[matchIndex] = match;
    setRounds[roundName](round);

    let nextSetRound, nextRound;
    if(roundName === "round16") {
      nextRound = round8.slice(); nextSetRound = setRound8;
    } else if(roundName === "round8") {
      nextRound = round4.slice(); nextSetRound = setRound4;
    } else if(roundName === "round4") {
      nextRound = round2.slice(); nextSetRound = setRound2;
    } else { return; }

    if(match.winner !== null) {
      const targetMatchIndex = Math.floor(matchIndex / 2);
      const slot = (matchIndex % 2 === 0) ? "aIndex" : "bIndex";
      let nextMatch = nextRound[targetMatchIndex] || { ...initialMatch };
      nextMatch[slot] = match.winner;
      nextRound[targetMatchIndex] = nextMatch;
      nextSetRound(nextRound);
    }
  };

  const handleTeamNameChange = (e, teamIndex) => {
    updateTeamName(teamIndex, e.target.value);
  };

  const handleScoreChange = (roundName, matchIndex, side, value) => {
    const setters = { round16: setRound16, round8: setRound8, round4: setRound4, round2: setRound2 };
    const rounds = { round16, round8, round4, round2 };

    let round = rounds[roundName].slice();
    let match = round[matchIndex];

    const score = value === "" ? null : parseInt(value, 10);
    if(side === "a") match.aScore = score; else match.bScore = score;

    round[matchIndex] = match;
    setters[roundName](round);
    computeWinner(roundName, matchIndex);
  };

  const handleFieldChange = (roundName, matchIndex, value) => {
    const setters = { round16: setRound16, round8: setRound8, round4: setRound4, round2: setRound2 };
    const rounds = { round16, round8, round4, round2 };

    let round = rounds[roundName].slice();
    let match = round[matchIndex];

    match.field = value;
    round[matchIndex] = match;
    setters[roundName](round);
  };

  const resetAll = () => {
    if(!window.confirm("Resettare tutti i risultati e campi?")) return;
    setTeams(teamsInit);
    let r16 = [];
    for(let i=0; i<8; i++) r16.push({ ...initialMatch, aIndex: i*2, bIndex: i*2+1 });

    setRound16(r16);
    setRound8(Array(4).fill(null).map(() => ({ ...initialMatch })));
    setRound4(Array(2).fill(null).map(() => ({ ...initialMatch })));
    setRound2([ { ...initialMatch } ]);
  };

  const autoFill = () => {
    const randomScore = () => Math.floor(Math.random() * 6);

    let r16 = round16.map((m, i) => {
      if(m.aIndex === null || m.bIndex === null) return m;
      const aScore = randomScore();
      const bScore = randomScore();
      const winner = aScore > bScore ? m.aIndex : (bScore > aScore ? m.bIndex : null);
      return { ...m, aScore, bScore, winner, field: `Campo ${i % 4 + 1}` };
    });
    setRound16(r16);

    const propagateRoundWinners = (source, target, setTarget) => {
      let newTarget = target.slice();
      source.forEach((m, i) => {
        if(!m.winner) return;
        const idx = Math.floor(i / 2);
        const slot = (i % 2 === 0) ? "aIndex" : "bIndex";
        let nextM = newTarget[idx] || { ...initialMatch };
        nextM[slot] = m.winner;
        newTarget[idx] = nextM;
      });
      setTarget(newTarget);
    };

    propagateRoundWinners(r16, round8, setRound8);

    let r8 = round8.map((m, i) => {
      if(m.aIndex === null || m.bIndex === null) return m;
      const aScore = randomScore();
      const bScore = randomScore();
      const winner = aScore > bScore ? m.aIndex : (bScore > aScore ? m.bIndex : null);
      return { ...m, aScore, bScore, winner, field: `Campo ${(i+1) % 4 + 1}` };
    });
    setRound8(r8);
    propagateRoundWinners(r8, round4, setRound4);

    let r4 = round4.map((m, i) => {
      if(m.aIndex === null || m.bIndex === null) return m;
      const aScore = randomScore();
      const bScore = randomScore();
      const winner = aScore > bScore ? m.aIndex : (bScore > aScore ? m.bIndex : null);
      return { ...m, aScore, bScore, winner, field: `Campo ${i+1}` };
    });
    setRound4(r4);
    propagateRoundWinners(r4, round2, setRound2);

    let r2 = round2.map((m, i) => {
      if(m.aIndex === null || m.bIndex === null) return m;
      const aScore = randomScore();
      const bScore = randomScore();
      const winner = aScore > bScore ? m.aIndex : (bScore > aScore ? m.bIndex : null);
      return { ...m, aScore, bScore, winner, field: "Campo finale" };
    });
    setRound2(r2);
  };

  useEffect(() => {
    let matchesPlayed = 0;
    let wins = {};
    let fieldsUsedSet = new Set();

    const countStats = (round) => {
      round.forEach(m => {
        if(m.aScore !== null || m.bScore !== null) matchesPlayed++;
        if(m.winner !== null) wins[m.winner] = (wins[m.winner] || 0) + 1;
        if(m.field && m.field.trim() !== "") fieldsUsedSet.add(m.field.trim());
      });
    };

    countStats(round16);
    countStats(round8);
    countStats(round4);
    countStats(round2);

    setStats({
      teamsCount: teams.filter(t => t && t.trim() !== "").length,
      matchesPlayed,
      fieldsUsed: fieldsUsedSet,
      wins
    });
  }, [teams, round16, round8, round4, round2]);

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif", maxWidth: 1200, margin: "0 auto" }}>
      <BackButton />

      <div style={{ textAlign: "center", marginBottom: 25 }}>
        <h2 style={{ fontSize: "1.8rem", color: "#007bff", marginBottom: 8 }}>Torneo Autunnale 2025</h2>
        <p style={{ fontSize: "1rem", color: "#444", maxWidth: 600, margin: "0 auto 18px" }}>
          Il classico torneo autunnale del nostro circolo con tanti premi e grande partecipazione.
        </p>
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 20
      }}>
        {[{roundName: "round16", title: "Ottavi (16)", rounds: round16},
          {roundName: "round8", title: "Quarti (8)", rounds: round8},
          {roundName: "round4", title: "Semifinali (4)", rounds: round4}]
          .map(({roundName, title, rounds}) => (
            <div key={roundName} style={roundStyle}>
              <h3>{title}</h3>
              {rounds.map((m, i) => (
                <div key={i} style={matchStyle}>
                  <MatchRow
                    type="a" roundName={roundName} roundIndex={rounds} matchIndex={i} match={m}
                    teamName={teams[m.aIndex]}
                    onTeamNameChange={roundName === "round16" ? (e) => handleTeamNameChange(e, m.aIndex) : null}
                    onScoreChange={handleScoreChange}
                    onFieldChange={handleFieldChange}
                  />
                  <MatchRow
                    type="b" roundName={roundName} roundIndex={rounds} matchIndex={i} match={m}
                    teamName={teams[m.bIndex]}
                    onTeamNameChange={roundName === "round16" ? (e) => handleTeamNameChange(e, m.bIndex) : null}
                    onScoreChange={handleScoreChange}
                    onFieldChange={handleFieldChange}
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
          ...roundStyle,
          position: "relative",
          minWidth: 220,
          maxWidth: 320,
          textAlign: "center"
        }}>
          <h3>Finale (2)</h3>
          {/* Immagine rimossa per non causare errore */}
          {round2.map((m, i) => (
            <div key={i} style={matchStyle}>
              <MatchRow
                type="a"
                roundName="round2"
                roundIndex={round2}
                matchIndex={i}
                match={m}
                teamName={teams[m.aIndex]}
                onScoreChange={handleScoreChange}
                onFieldChange={handleFieldChange}
              />
              <MatchRow
                type="b"
                roundName="round2"
                roundIndex={round2}
                matchIndex={i}
                match={m}
                teamName={teams[m.bIndex]}
                onScoreChange={handleScoreChange}
                onFieldChange={handleFieldChange}
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
      </div>
    </div>
  );
}

function MatchRow({ type, roundName, roundIndex, matchIndex, match, teamName, onTeamNameChange, onScoreChange, onFieldChange }) {
  return (
    <div style={teamRowStyle}>
      {onTeamNameChange ? (
        <input
          type="text"
          value={teamName || ""}
          onChange={onTeamNameChange}
          style={teamNameInputStyle}
          aria-label={`Nome squadra ${type}`}
        />
      ) : (
        <div style={teamNameDisplayStyle}>{teamName || ""}</div>
      )}
      <input
        type="number"
        min="0"
        value={type === "a" ? match.aScore ?? "" : match.bScore ?? ""}
        onChange={(e) => onScoreChange(roundName, matchIndex, type, e.target.value)}
        style={scoreInputStyle}
        aria-label={`Punteggio squadra ${type}`}
      />
      <input
        type="text"
        placeholder="Campo"
        value={match.field}
        onChange={(e) => onFieldChange(roundName, matchIndex, e.target.value)}
        style={fieldInputStyle}
      />
    </div>
  );
}

function Stats({ stats }) {
  return (
    <div style={{ ...roundStyle, minWidth: 260 }}>
      <h3>Statistiche</h3>
      <div style={{ fontSize: 12, color: "#666" }}>Squadre partecipanti: {stats.teamsCount}</div>
      <div style={{ fontSize: 12, color: "#666" }}>Partite giocate: {stats.matchesPlayed}</div>
      <div style={{ fontSize: 12, color: "#666" }}>
        Campi usati (indicati manualmente): {stats.fieldsUsed.size}
      </div>
      <h4>Vittorie per squadra</h4>
      <div>
        {Object.entries(stats.wins)
          .sort(([, a], [, b]) => b - a)
          .map(([idx, win], i) => (
            <div key={i}>
              {idx}: {win} vittorie
            </div>
          ))}
      </div>
      <h4>Campi segnati</h4>
      <div style={{ fontSize: 12, color: "#666" }}>
        {Array.from(stats.fieldsUsed).map((field, i) => (
          <span key={i} style={fieldPillStyle}>
            {field}
          </span>
        ))}
      </div>
    </div>
  );
}

const roundStyle = {
  background: "white",
  padding: 12,
  borderRadius: 8,
  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  minWidth: 220,
  maxWidth: 320,
  flex: "1 1 220px",
};

const matchStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  padding: 8,
  borderBottom: "1px solid #eee",
  marginBottom: 6,
};

const teamRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 8,
};

const teamNameInputStyle = {
  flex: 1,
  fontSize: 14,
  padding: 4,
  borderRadius: 4,
  border: "1px solid #ccc",
};

const teamNameDisplayStyle = {
  flex: 1,
  fontSize: 14,
  padding: 4,
};

const scoreInputStyle = {
  width: 60,
  padding: 4,
  borderRadius: 4,
  border: "1px solid #ccc",
};

const fieldInputStyle = {
  width: 80,
  padding: 4,
  borderRadius: 4,
  border: "1px solid #ccc",
};

const buttonStyle = {
  padding: "8px 12px",
  borderRadius: 6,
  border: 0,
  cursor: "pointer",
  backgroundColor: "#007bff",
  color: "white",
  fontWeight: "600",
};

const fieldPillStyle = {
  background: "#eef",
  padding: "6px 8px",
  borderRadius: "999px",
  fontSize: "0.9em",
  marginRight: 4,
  display: "inline-block",
};
