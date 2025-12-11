import React from 'react';
import { Trophy, Users, Calendar, MapPin, Loader2 } from 'lucide-react';

export default function TournamentBracket({ matches = [], tournament = null, loading = false }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 bg-gray-50 rounded-2xl">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
        <span className="text-lg text-gray-600">Caricamento tabellone...</span>
      </div>
    );
  }

  if (!matches.length) {
    return (
      <div className="text-center py-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl border-2 border-dashed border-gray-300">
        <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Nessuna partita nel tabellone</h3>
        <p className="text-gray-600">Il tabellone verrà popolato dopo le prime iscrizioni</p>
      </div>
    );
  }

  // Raggruppa partite per round
  const rounds = {};
  matches.forEach((match) => {
    const roundNum = match.round_number || 1;
    if (!rounds[roundNum]) rounds[roundNum] = [];
    rounds[roundNum].push(match);
  });

  const roundKeys = Object.keys(rounds).sort((a, b) => Number(a) - Number(b));

  // Funzione helper per ottenere nome giocatore
  const getPlayerName = (playerId) => {
    if (!playerId) return 'TBD';
    return `Giocatore ${playerId}`; // Sostituisci con lookup reale
  };

  return (
    <div className="space-y-6">
      {/* Header torneo */}
      {tournament && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-3xl shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-1">{tournament.name}</h2>
              <div className="flex items-center gap-4 text-sm opacity-90 mt-2">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(tournament.start_date).toLocaleDateString('it-IT')}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {tournament.location}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {tournament.max_players || 32} giocatori
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabellone */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-h-[600px] overflow-y-auto p-4 bg-gray-50 rounded-3xl">
        {roundKeys.map((roundKey) => (
          <div key={roundKey} className="lg:col-span-1 bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-white/50 hover:shadow-2xl transition-all">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">
                  Round {roundKey}
                  {roundKey === '1' && ' (Quarti di finale)'}
                  {roundKey === '2' && ' (Semifinali)'}
                  {roundKey === '3' && ' (Finale)'}
                </h3>
                <p className="text-sm text-gray-600">
                  {rounds[roundKey].length} partita{e}s
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {rounds[roundKey].map((match) => (
                <div 
                  key={match.id} 
                  className="group bg-gradient-to-b from-gray-50 to-white p-4 rounded-xl border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer"
                >
                  {/* Giocatori */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between py-1">
                      <span className="font-semibold text-gray-900 text-sm">
                        {getPlayerName(match.player_a1_id)}
                      </span>
                      <span className="text-2xl font-bold text-gray-400 group-hover:text-blue-600">
                        vs
                      </span>
                      <span className="font-semibold text-gray-900 text-sm">
                        {getPlayerName(match.player_b1_id)}
                      </span>
                    </div>
                    
                    {/* Secondo giocatore se doppio */}
                    {match.player_a2_id || match.player_b2_id ? (
                      <div className="flex items-center justify-between py-1 opacity-75">
                        <span className="text-xs text-gray-600">
                          {getPlayerName(match.player_a2_id)}
                        </span>
                        <span className="text-xs text-gray-400">vs</span>
                        <span className="text-xs text-gray-600">
                          {getPlayerName(match.player_b2_id)}
                        </span>
                      </div>
                    ) : null}
                  </div>

                  {/* Dettagli partita */}
                  <div className="flex items-center justify-between text-xs text-gray-500 bg-blue-50/50 p-2 rounded-lg group-hover:bg-blue-50">
                    <span>Campo: {match.campo_assegnato || 'Da assegnare'}</span>
                    {match.match_date && (
                      <span>
                        {new Date(match.match_date).toLocaleDateString('it-IT', {
                          weekday: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    )}
                  </div>

                  {/* Status */}
                  {match.status && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        match.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : match.status === 'scheduled' 
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {match.status === 'completed' ? 'Completata' : 
                         match.status === 'scheduled' ? 'Programmata' : 'In corso'}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
