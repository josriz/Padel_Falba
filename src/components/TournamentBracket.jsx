// src/components/TournamentBracket.jsx - ✅ ADATTATO AI TUOI DATI matches
import React from 'react';

export default function TournamentBracket({ matches }) {
  if (!matches || matches.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🏆</span>
        </div>
        <h3 className="text-xl font-bold mb-2">Tabellone vuoto</h3>
        <p className="text-lg">Nessuna partita programmata</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h3 className="text-2xl font-black text-center mb-8 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
        🏆 TABELLONE
      </h3>
      
      {matches.map(match => (
        <div key={match.id} className="grid grid-cols-2 gap-6 items-center bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-emerald-300 transition-all">
          
          {/* Squadra 1 */}
          <div className="flex flex-col items-center gap-1 p-4 bg-gradient-to-b from-emerald-50 to-green-50 rounded-2xl">
            <span className="font-black text-lg text-emerald-800">
              {match.player1 || match.team1_name || 'Squadra A'}
            </span>
            <span className="text-xs text-gray-600">
              {match.round ? `Round: ${match.round}` : ''}
            </span>
          </div>

          {/* SCORE + CAMPO */}
          <div className="text-center p-4">
            <div className="text-3xl font-black text-gray-900 mb-2">
              {match.score || '0-0'}
            </div>
            <div className="space-y-1 text-sm">
              <span className="font-semibold text-emerald-700 block bg-emerald-100 px-3 py-1 rounded-full">
                Campo: {match.court || match.campo_assegnato || '-'}
              </span>
              <span className="text-gray-500 text-xs">
                {match.status || 'In programma'}
              </span>
              {match.winner && (
                <span className="text-green-600 font-bold text-sm">
                  Vincitore: {match.winner}
                </span>
              )}
            </div>
          </div>

          {/* Squadra 2 */}
          <div className="flex flex-col items-center gap-1 p-4 bg-gradient-to-b from-blue-50 to-indigo-50 rounded-2xl">
            <span className="font-black text-lg text-blue-800">
              {match.player2 || match.team2_name || 'Squadra B'}
            </span>
            <span className="text-xs text-gray-600">
              {match.id ? `ID: ${match.id.slice(0,8)}...` : ''}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
