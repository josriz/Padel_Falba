import React, { useState, useEffect } from "react";

const initialMatch = { 
  aIndex: null, 
  bIndex: null, 
  aScore: null, 
  bScore: null, 
  winner: null, 
  field: "" 
};

const generateInitialRound = (playersCount) => {
  const matchesCount = Math.ceil(playersCount / 2);
  return Array(matchesCount).fill(null).map((_, i) => ({
    ...initialMatch,
    aIndex: 2 * i < playersCount ? 2 * i : null,
    bIndex: 2 * i + 1 < playersCount ? 2 * i + 1 : null,
  }));
};

const defaultTeams = Array(32).fill(null).map((_, i) => `Giocatore ${i + 1}`);

export default function TournamentBracket({ players = defaultTeams }) {
  const [teams, setTeams] = useState(players);
  const [round16, setRound16] = useState(() => generateInitialRound(players.length));
  const [round8, setRound8] = useState([]);
  const [round4, setRound4] = useState([]);
  const [round2, setRound2] = useState([]);

  // Initialize the array size for subsequent rounds
  useEffect(() => {
    setRound8(Array(Math.ceil(round16.length / 2)).fill(null).map(() => ({ ...initialMatch })));
    setRound4(Array(Math.ceil(round8.length / 2)).fill(null).map(() => ({ ...initialMatch })));
    setRound2(Array(Math.ceil(round4.length / 2)).fill(null).map(() => ({ ...initialMatch })));
  }, []);

  // Update winner and propagate to next round
  const updateMatchScore = (round, setRound, matchIndex, side, score) => {
    let newRound = [...round];
    const match = { ...newRound[matchIndex] };
    const parsedScore = score === "" ? null : parseInt(score, 10);

    if (side === "a") {
      match.aScore = parsedScore;
    } else {
      match.bScore = parsedScore;
    }

    // Determine winner
    if (match.aScore !== null && match.bScore !== null) {
      if (match.aScore > match.bScore) match.winner = match.aIndex;
      else if (match.bScore > match.aScore) match.winner = match.bIndex;
      else match.winner = null;
    } else {
      match.winner = null;
    }
    newRound[matchIndex] = match;
    setRound(newRound);

    advanceWinner(round, matchIndex, match.winner);
  };

  const advanceWinner = (currentRound, matchIndex, winner) => {
    if (!winner) return;
    let nextRound, setNextRound;

    if (currentRound === round16) {
      nextRound = [...round8];
      setNextRound = setRound8;
    } else if (currentRound === round8) {
      nextRound = [...round4];
      setNextRound = setRound4;
    } else if (currentRound === round4) {
      nextRound = [...round2];
      setNextRound = setRound2;
    } else {
      return; // round2 finale non ha ulteriori round
    }

    const targetMatchIndex = Math.floor(matchIndex / 2);
    const slot = matchIndex % 2 === 0 ? "aIndex" : "bIndex";

    let nextMatch = nextRound[targetMatchIndex] || { ...initialMatch };
    nextMatch[slot] = winner;

    nextRound[targetMatchIndex] = nextMatch;
    setNextRound(nextRound);
  };

  function Match({ match, teamNameA, teamNameB, onScoreChange, matchIndex, round, setRound }) {
    return (
      <div style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "center" }}>
        <span>{teamNameA || "bye"}</span>
        <input
          type="number"
          min="0"
          style={{ width: 40 }}
          value={match.aScore ?? ""}
          onChange={e => onScoreChange(round, setRound, matchIndex, "a", e.target.value)}
          disabled={teamNameA === null}
        />
        <span>vs</span>
        <input
          type="number"
          min="0"
          style={{ width: 40 }}
          value={match.bScore ?? ""}
          onChange={e => onScoreChange(round, setRound, matchIndex, "b", e.target.value)}
          disabled={teamNameB === null}
        />
        <span>{teamNameB || "bye"}</span>
        {match.winner !== null && (
          <span style={{ marginLeft: "auto" }}>
            Vincitore: {teams[match.winner] || "bye"}
          </span>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#007bff" }}>Torneo Padel</h1>

      <h3>Turno 1</h3>
      {round16.map((match, i) => (
        <Match key={`r16-${i}`} match={match} teamNameA={teams[match.aIndex]} teamNameB={teams[match.bIndex]} onScoreChange={updateMatchScore} matchIndex={i} round={round16} setRound={setRound16} />
      ))}

      <h3>Turno 2</h3>
      {round8.map((match, i) => (
        <Match key={`r8-${i}`} match={match} teamNameA={teams[match.aIndex]} teamNameB={teams[match.bIndex]} onScoreChange={updateMatchScore} matchIndex={i} round={round8} setRound={setRound8} />
      ))}

      <h3>Semifinali</h3>
      {round4.map((match, i) => (
        <Match key={`r4-${i}`} match={match} teamNameA={teams[match.aIndex]} teamNameB={teams[match.bIndex]} onScoreChange={updateMatchScore} matchIndex={i} round={round4} setRound={setRound4} />
      ))}

      <h3>Finale</h3>
      {round2.map((match, i) => (
        <Match key={`r2-${i}`} match={match} teamNameA={teams[match.aIndex]} teamNameB={teams[match.bIndex]} onScoreChange={updateMatchScore} matchIndex={i} round={round2} setRound={setRound2} />
      ))}
    </div>
  );
}
