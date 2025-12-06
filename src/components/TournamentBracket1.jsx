// src/components/TournamentBracket.jsx
import React from 'react';

const demoMatches = [
  {
    id: 'M1',
    round: 'Ottavi',
    court: 1,
    player1: 'Rossi / Bianchi',
    player2: 'Verdi / Neri',
    score: '6-4 6-3',
    status: 'Giocata',
    winner: 'Rossi / Bianchi',
  },
  {
    id: 'M2',
    round: 'Ottavi',
    court: 2,
    player1: 'Blu / Gialli',
    player2: 'Grigi / Marroni',
    score: '7-5 6-4',
    status: 'Giocata',
    winner: 'Blu / Gialli',
  },
  {
    id: 'M3',
    round: 'Ottavi',
    court: 3,
    player1: 'Rosa / Viola',
    player2: 'Arancio / Celeste',
    score: '6-2 6-1',
    status: 'Giocata',
    winner: 'Rosa / Viola',
  },
  {
    id: 'M4',
    round: 'Ottavi',
    court: 4,
    player1: 'Azzurri / Neri',
    player2: 'Bianchi / Verdi',
    score: '3-6 6-4 10-7',
    status: 'Giocata',
    winner: 'Azzurri / Neri',
  },
  {
    id: 'Q1',
    round: 'Quarti',
    court: 1,
    player1: 'Rossi / Bianchi',
    player2: 'Blu / Gialli',
    score: '6-4 7-5',
    status: 'Giocata',
    winner: 'Rossi / Bianchi',
  },
  {
    id: 'Q2',
    round: 'Quarti',
    court: 2,
    player1: 'Rosa / Viola',
    player2: 'Azzurri / Neri',
    score: '6-3 6-4',
    status: 'Giocata',
    winner: 'Rosa / Viola',
  },
  {
    id: 'S1',
    round: 'Semifinale',
    court: 1,
    player1: 'Rossi / Bianchi',
    player2: 'Rosa / Viola',
    score: '6-4 6-4',
    status: 'Giocata',
    winner: 'Rossi / Bianchi',
  },
  {
    id: 'F1',
    round: 'Finale',
    court: 'Centrale',
    player1: 'Rossi / Bianchi',
    player2: 'Lupi / Tigri',
    score: '6-4 3-6 10-8',
    status: 'Giocata',
    winner: 'Rossi / Bianchi',
  },
];

export default function TournamentBracket({ matches }) {
  const data = matches && matches.length > 0 ? matches : demoMatches;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h3 className="text-2xl font-black text-center mb-8 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
        🏆 TABELLONE TORNEO
      </h3>

      {data.map(match => (
        <div
          key={match.id}
          className="grid grid-cols-3 gap-4 items-center bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-lg"
        >
          {/* Squadra 1 */}
          <div className="flex flex-col items-center gap-1 p-4 bg-gradient-to-b from-emerald-50 to-green-50 rounded-2xl">
            <span className="font-black text-lg text-emerald-800">
              {match.player1 || 'Squadra A'}
            </span>
            <span className="text-xs text-gray-600">
              {match.round ? `Round: ${match.round}` : ''}
            </span>
          </div>

          {/* SCORE + CAMPO */}
          <div className="text-center p-4">
            <div className="text-sm text-gray-500 mb-1">
              {match.round} • Campo {match.court}
            </div>
            <div className="text-3xl font-black text-gray-900 mb-2">
              {match.score || '0-0'}
            </div>
            {match.winner && (
              <div className="text-green-600 font-bold text-sm">
                Vincitore: {match.winner}
              </div>
            )}
          </div>

          {/* Squadra 2 */}
          <div className="flex flex-col items-center gap-1 p-4 bg-gradient-to-b from-blue-50 to-indigo-50 rounded-2xl">
            <span className="font-black text-lg text-blue-800">
              {match.player2 || 'Squadra B'}
            </span>
            <span className="text-xs text-gray-600">
              ID: {match.id}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
